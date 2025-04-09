
const asyncHandler = require("express-async-handler");

const CustomNotFoundError = require("../errors/CustomNotFoundError");

const Mentor = require("../models/Mentor")

Mentor.syncIndexes().then(() => {
  console.log("Indexes synced for Mentor collection");
});

// The function will automatically catch any errors thrown and call the next function

const getMentors = asyncHandler(async (req, res) => {

  //http://localhost:3000/mentor?lon=13.006044802474783&lat=77.65024801937898

  // http://localhost:3000/mentor?query=ai&usermode=1&lon=13.006044802474783&lat=77.65024801937898

  const { query, lon, lat, rating, fee, page, distance, usermode } = req.query;

  // mode = 0 -> online only, 1 -> offline only, 2 -> both

  // w/location : online only , offline only,  Hybrid (closer preferred)                                         : 0,1,2  - user can select any mode        

  // w/0        : db search: online only + Hybrid                          ( offline disabled)                   : 0 -     user can select online only

  const mode = usermode || 0;
  const limit = 6;
  const skip = (page ? page - 1 : 0) * limit;
  const maxDistance = distance || 50000;

  const filters = {};

  if (rating) filters.averageRating = { $gte: parseFloat(rating) };
  if (fee) filters.fee = { $lte: parseFloat(fee) }

  const pipeline = [];

  if (mode >= 1 && lon && lat) {

    const userLocation = {
      type: "Point",
      coordinates: [parseFloat(lon), parseFloat(lat)]       // GeoJSON format is [longitude, latitude]
    };

    filters.teachingMode = { $in: ["Offline", "Hybrid"] };

    // const additionalFilters = {
    //   $match: filters
    // };

    if (query){
      const matchedMentorIds = await Mentor
      .find({ $text: { $search: query } }, { _id: 1 })
      .lean();


      const idList = matchedMentorIds.map(doc => doc._id);
      filters._id =  { $in: idList }



    }
  

    const location_filter_stage = {
      $geoNear: {
        near: userLocation,
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
        query: filters   // Move filters here if needed
      }
    }

    pipeline.push(location_filter_stage);

    if (mode == 1) {     // offline only - default if location data present

      const sort_stage = {
        $sort: {
          distance: 1,    // ->   geaNear data is sorted by nearest distance by default  
          averageRating: -1,
        }
      }

      pipeline.push(sort_stage);


    }
    else if (mode == 2) {            // offline + online


      const onlineFilters = {...filters};  // Clone the filters object
      onlineFilters.teachingMode = { $in: ["Online"] };  // Change only teachingMode in the clone
  
      const union_pipeline = {
          $match: onlineFilters
      };

      const union = {
        $unionWith: {
          coll: "mentor",
          pipeline: [union_pipeline]
        }
      }

      const addfield = {
        $addFields: {
          distanceExists: { $cond: { if: { $gt: ["$distance", null] }, then: 1, else: 0 } }
        }
      }

      const sort_stage = {
        $sort: {
          distanceExists: -1, // Move null distances to the end
          distance: 1 // Sort by nearest distance
        }         // Sort nearest distance then by highest rating
      }

      pipeline.push(union, addfield, sort_stage);

    }

  }
  else if (mode == 0) {        // online only


    filters.teachingMode = { $in: ["Online", "Hybrid"] };

    if (query) filters["$text"] = { $search: query };

    
    const additionalFilters = {
      $match: filters
    };

    const addfield =   {
      $addFields: {
        score: { $meta: "textScore" }
      }
    }
    const sort_filters =  {
      averageRating: -1,
    }

    const sort_stage = {
      $sort: sort_filters
    }

    if (query){
      sort_filters.score =  { $meta: "textScore" };
      pipeline.push(additionalFilters,addfield, sort_stage);
    }

    else pipeline.push(additionalFilters, sort_stage);
  }


  const prj = {
    $project: {
      _id: 1,
      name: 1,
      classDetails: 1,
      averageRating: 1,
      city: 1,
      fee: 1,
      teachingMode: 1,
      distance: 1,
      score: 1,
    }
  }

  pipeline.push(prj);

  pipeline.push({ $skip: skip});

  pipeline.push({ $limit: limit});

  const results = await Mentor.aggregate(pipeline);

  // console.log(results)
  res.send(results);
  return;

  //   if (!user) {
  //     throw new CustomNotFoundError("Author not found");
  //   }

});


module.exports = { getMentors };
