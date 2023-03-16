const {parking}=require('../models/ParkingModel')
const {BadReqErr}=require('../errorclasses/badReq')
const {GetRandString}=require('../utils/randomString')
const {InternalServerErr}=require('../errorclasses/InternalServer')
const {section}=require('../models/SectionsModel')
const {distance}=require('../utils/getDistanceTwoPoints')
const {car}=require('../models/CarsModel')
const {user}=require('../models/BaseModel')
const {nearestModel}=require('../models/NearestModel')
const {bufferToDataURI}=require('../utils/turnBuffertoDataURI')
const {uploadToCloudinary}=require('../utils/uploadImage')
module.exports={
    create_parking:async(req,res)=>{
        const {name,desc,fullCapacity,location,floorCapacity,sortedNearest}=req.body;
        try{
            let img=[];
            if(req.files){
                if(req.files.img.length===undefined){
                    img=[req.files.img];
                }else{
                    img=[...req.files.img];
                }
            }
            if(floorCapacity>fullCapacity){
                throw new BadReqErr('You exceeded the capacity')
            }
            const sub=fullCapacity - floorCapacity;
            const loc={type:'Point',coordinates:[location.lon,location.lat]}
            const Parking=await parking.create({
                name,
                desc,
                fullCapacity:sub,
                location,
                takenSections:[{sectionChar:'a',capacity:floorCapacity}],
                loc,
                nearest:sortedNearest
            })
            for(let i=0;i<sortedNearest.length;i++){
                const data=sortedNearest[i];
                await nearestModel.create({
                    ...data,
                    place:data.place?data.place:[],
                    parkingId:Parking._id
                })
            }
            
            await section.create({
                sectionChar:'a',
                capacity:floorCapacity,
                parkingId:Parking._id
            })
            for(let i=0;i<img.length;i++){
                let item=img[i]
                const fileFormat = item.mimetype.split('/')[1]
                const { base64 } = bufferToDataURI(fileFormat, item.data)
                const imageDetails = await uploadToCloudinary(base64, fileFormat)
                console.log(imageDetails)
                Parking.images.push(imageDetails.url)
                await Parking.save()
            }
           
            
            return res.status(201).send({msg:'Parking Created Successfully',Parking,status:true})
        }catch(err){
            throw new InternalServerErr(err.message)
        }
    },
    create_section:async(req,res)=>{
        const {capacity,sectionChar,id}=req.body;
        try{
            const p=await parking.findById(id)
            if(capacity>p.fullCapacity){
                throw new BadReqErr('You provided a capacity that is bigger than full capacity.')
            }
            const sub = p.fullCapacity - capacity;
            const available=p.availableSections.includes(sectionChar)
            if(!available){
                throw new BadReqErr('You already created this section.')
            }

            p.availableSections[p.availableSections.indexOf(sectionChar)]=undefined;
            p.haveSections=true;
            p.takenSections.push({sectionChar,capacity})
            p.fullCapacity=sub;
            await p.save()

            const Section=await section.create({
                sectionChar,
                capacity,
                parkingId:id
            })

            return res.status(201).send({msg:'Section Created Successfully',Section,status:true})

        }catch(err){
            throw new InternalServerErr(err.message)
        }
        
    },
    add_cars:async(req,res)=>{
        //id is stands for the parking id that we are trying to enter
        const {carId,location,id,enterGate}=req.body;
        try{
            const Parking=await parking.findById(id)
            const distanceGate=Parking.nearest.filter((item)=>item.gate===enterGate)
            const DGate=distanceGate[0].distanceToCenter;//100 M
            const ParkingLoc=Parking.location;
            //get distance from car to parking
            const d=distance(location.lat,location.lon,ParkingLoc.lat,ParkingLoc.lon)//120 M
            const foundCar=await car.findOne({carId,parkingId:id})
            console.log(d,DGate)
            if(d>DGate){
                throw new BadReqErr('Car is far from the parking')
            }
            if(foundCar){
                throw new BadReqErr('You already in the parking')
            }
            
            if(Parking.haveSections){
                //aval[0] for example is a 2 then we will sub 1 from capacity and give him a + random num 
                //also update the sections model for this section and also sub 1 
                const taken=Parking.takenSections;
                const aval=taken.filter((item)=>item.capacity>0)
                if(aval.length===0){
                    throw new BadReqErr('This Parking Is FullFill')
                }
                const pos = taken.map(e => e.sectionChar).indexOf(aval[0].sectionChar);//a
                const c=Parking.takenSections[pos].capacity//get the object thats holds a and get the capacity
                Parking.takenSections[pos]={...Parking.takenSections[pos],capacity:c-1}
                console.log(c, Parking.takenSections[pos])
                await Parking.save()
                const Section=await section.findOne({sectionChar:aval[0].sectionChar,parkingId:Parking._id})
                Section.capacity=c-1;
                console.log(Section.capacity)

                await Section.save()

                const placeOfTheCar=`${aval[0].sectionChar}${Section.capacity+1}`
                const numLocation=Section.capacity+1;
                const carPlaceSectionChar=aval[0].sectionChar;
                const startTime = new Date().getTime();
                const Car=await car.create({
                    carId,
                    startTime,
                    location:placeOfTheCar,
                    numLocation,
                    sectionChar:carPlaceSectionChar,
                    parkingId:id
                })
                
                return res.status(201).send({msg:'Car Is Added Successfully',Car,status:true})

            }else{
                const taken=Parking.takenSections;
                if(taken[0].capacity===0){
                    throw new BadReqErr('This Parking Is FullFill')
                }
                Parking.takenSections[0]={...Parking.takenSections[0],capacity:taken[0].capacity - 1}
                console.log(Parking.takenSections[0])
                await Parking.save();
                const Section=await section.findOne({sectionChar:Parking.takenSections[0].sectionChar,parkingId:Parking._id})
                Section.capacity = Section.capacity - 1;
                await Section.save()
            
                const placeOfTheCar=`${Parking.takenSections[0].sectionChar}${Section.capacity+1}`
                const numLocation=Section.capacity+1;
                const carPlaceSectionChar=Parking.takenSections[0].sectionChar;
                const startTime = new Date().getTime();
                const Car=await car.create({
                    carId,
                    startTime,
                    location:placeOfTheCar,
                    numLocation,
                    sectionChar:carPlaceSectionChar,
                    parkingId:id
                })
                
                return res.status(201).send({msg:'Car Is Added Successfully In the parking',Car,status:true})
            }

        }catch(err){
            throw new InternalServerErr(err.message)
        }
    },
    remove_cars:async(req,res)=>{
        //id is stands for the parking id that we are trying to enter
        const {carId,location,id,outGate}=req.body;
        try{
            const p=await parking.findById(id)
            const ParkingLoc=p.location;
            const distanceGate=p.nearest.filter((item)=>item.gate===outGate)
            const DGate=distanceGate[0].distanceToCenter;//Gate 1 is 50 M far 
            const d=distance(location.lat,location.lon,ParkingLoc.lat,ParkingLoc.lon)//20 M

            if(d<=DGate){
                throw new BadReqErr('Car still in the parking')
            }

            const Car=await car.findOneAndDelete({carId,parkingId:id})
            if(!Car){
                throw new BadReqErr('Car is already out from the parking')
            }
            const s=Car.sectionChar;
            const startTime=Car.startTime;
            
            const Section=await section.findOne({sectionChar:s,parkingId:id})
            const pos =  p.takenSections.map(e => e.sectionChar).indexOf(s);
            p.takenSections[pos]={...p.takenSections[pos],capacity:p.takenSections[pos].capacity+1}
            Section.capacity=Section.capacity + 1;
            await p.save()
            await Section.save()

            const User=await user.findById(carId)
            const endTime = new Date().getTime();
            const duration= (endTime - startTime)/3600000; //convert ms to hours
            User.history.push(duration)
            await User.save()
            return res.status(200).send({msg:'Car Is removed Successfully from the parking',Car,status:true})

        }catch(err){
            throw new InternalServerErr(err.message)
        }
    },
    get_nearest_parkings:async(req,res)=>{
        const {location} =req.body;
        if(!location||!location.lat||!location.lon){
            throw new BadReqErr('Please provide the right creds.')
        }
        try{
            const NearestParkings=await parking.find(
                {
                   "loc": {
                     $near: {
                       $geometry: {
                          type: "Point" ,
                          coordinates: [ location.lon , location.lat ]
                       },
                     }
                   }
                }
                )
                if(!NearestParkings||NearestParkings.length===0){
                    throw new BadReqErr('There are no parkings')
                }

                return res.status(200).send({msg:'Fetched Nearest Parkings Successfully',NearestParkings,status:true})
            }
        catch(err){
            throw new InternalServerErr(err.message)
        }
    }
    
}