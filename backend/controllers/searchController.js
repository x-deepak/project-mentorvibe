const asyncHandler = require("express-async-handler");

const CustomNotFoundError = require("../errors/CustomNotFoundError");

const Mentor = require("../models/Mentor")
const User = require("../models/User");

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
  const maxDistance = parseInt(distance) || 50000;

  const filters = {};

  if (rating) filters.averageRating = { $gte: parseFloat(rating) };
  if (fee) filters.fee = { $lte: parseFloat(fee) }

  const pipeline = [];

  console.log("location :",lon, lat);

  if (mode >= 1 && lon && lat) {

    console.log("mode 2 triggerd");
    const userLocation = {
      type: "Point",
      coordinates: [parseFloat(lon), parseFloat(lat)]       // GeoJSON format is [longitude, latitude]
    };

    filters.teachingMode = { $in: ["Offline", "Hybrid"] };

    // const additionalFilters = {
    //   $match: filters
    // };

    if (query) {
      const matchedMentorIds = await Mentor
        .find({ $text: { $search: query } }, { _id: 1 })
        .lean();


      const idList = matchedMentorIds.map(doc => doc._id);
      filters._id = { $in: idList }



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


      const onlineFilters = { ...filters };  // Clone the filters object
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
  else {      // online only


    console.log("mode 0 triggerd");

    filters.teachingMode = { $in: ["Online", "Hybrid"] };

    if (query) filters["$text"] = { $search: query };


    const additionalFilters = {
      $match: filters
    };

    const addfield = {
      $addFields: {
        score: { $meta: "textScore" }
      }
    }
    const sort_filters = {
      averageRating: -1,
    }

    const sort_stage = {
      $sort: sort_filters
    }

    if (query) {
      sort_filters.score = { $meta: "textScore" };
      pipeline.push(additionalFilters, addfield, sort_stage);
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

  pipeline.push({ $skip: skip });

  pipeline.push({ $limit: limit });

  const results = await Mentor.aggregate(pipeline);

  // console.log(results)
  res.send(results);
  return;

  //   if (!user) {
  //     throw new CustomNotFoundError("Author not found");
  //   }

});




const getMentor = asyncHandler(async (req, res) => {

  const { id } = req.query;

  const mentorId = id;
  const mentor = await Mentor.findById(mentorId, 'name email professionalTitle profileTitle profilePicture skills teachingMode bio fee classDetails ratings averageRating city studentCount');

  res.send(mentor);
  return;

});




const getRatings = asyncHandler(async (req, res) => {
  const { id } = req.query; // Mentor ID

  if (!id) {
    return res.status(400).json({ message: "Mentor ID is required" });
  }

  try {
    // Find the mentor by ID and populate the ratings with user details
    const mentor = await Mentor.findById(id).populate({
      path: "ratings.user",
      model: "User",
      select: "name profileImage", // Fetch the user's name and profileImage
    });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Map the ratings to include user name, profileImage, rating number, and review string
    const ratings = mentor.ratings.map((rating) => ({
      userName: rating.user?.name || "Anonymous",
      profileImage: rating.user?.profileImage || null,
      rating: rating.rating,
      review: rating.review,
    }));

    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = { getMentors, getMentor, getRatings };
