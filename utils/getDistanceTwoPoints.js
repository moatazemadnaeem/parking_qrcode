const distance=(lat1,lon1,lat2,lon2)=>{
   const EarthRadius=6371;
    
   const lat1Rad= convertToRadians(lat1);
   const lon1Rad= convertToRadians(lon1);
   const lat2Rad= convertToRadians(lat2);
   const lon2Rad= convertToRadians(lon2);
   
   return (EarthRadius * Math.acos(((Math.sin(lat1Rad)*Math.sin(lat2Rad)) 
   + (Math.cos(lat1Rad) *  Math.cos(lat2Rad) * Math.cos(lon1Rad-lon2Rad)))))*1000
}
const convertToRadians=(coord)=>{
    return coord*(Math.PI/180)
}
module.exports={distance}