const Publication = require("../model/PublicationModel.cjs");

// Update your addPublication controller to handle missing fields and respond with appropriate error message

exports.addPublication = async (req, res) => {
  console.log("req",req.body)
  console.log("req",req.file)
  try {
    // Ensure all required fields are present in the request body
    const { address, type, description, bathrooms, kitchens, salon, bedrooms, price,userName,userId } = req.body;
    if (!address || !type || !description || !bathrooms || !kitchens || !salon || !bedrooms || !price) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const images = req.files ? req.files.map(file => file.path) : [];
    console.log("req",req.file,images)
    // Create a new publication
    const newPublication = new Publication({
      userId,userName,
      address,
      type,
      description,
      bathrooms,
      kitchens,
      salon,
      bedrooms,
      price,
      images,
    });
console.log("newPub",newPublication)
    await newPublication.save();
    res.status(201).json({ message: 'Publication created successfully!',data: newPublication});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error while adding publication!' });
  }
};





exports.getPublication = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using user authentication middleware

    // Fetch publication data based on user ID or any other criteria
    const publications = await Publication.find({ userId }); // Adjust this query based on your database schema

    if (!publications || publications.length === 0) {
      console.error('Publications not found for user ID:', userId);
      return res.status(404).json({ error: 'Publications not found' });
    }

    console.log('Publications retrieved successfully for user ID:', userId);
    res.json(publications);
  } catch (err) {
    console.error('Error fetching publications:', err.message);
    res.status(500).send('Server Error');
  }
};
const mongoose = require('mongoose');

exports.getPublicationById = async (req, res) => {
  try {
    const publicationId = req.params.id; // Get the publication ID from the request parameters
    console.log("Publication ID:", publicationId);

    // const userId = req.user.id; // Assuming you're using user authentication middleware
    const objectId = new mongoose.Types.ObjectId(publicationId);
    // Ensure publicationId is in the correct format if needed
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
      return res.status(400).json({ error: 'Invalid publication ID' });
    }

    // Convert string to ObjectId
    console.log("ObjectId:", objectId);
    // Fetch the publication data based on publication ID and user ID
    const publication = await Publication.findOne({ _id: objectId}); // Adjust this query based on your database schema

    if (!publication) {
      console.error('Publication not found for publication ID:', publicationId);
      return res.status(404).json({ error: 'Publication not found' });
    }

    console.log('Publication retrieved successfully for publication ID:', publication);
    return res.json(publication);
  } catch (err) {
    console.error('Error fetching publication:', err.message);
    res.status(500).send('Server Error');
  }
};
exports.AllgetPublication = async (req, res) => {
  try {
    // Fetch all publication data
    const publications = await Publication.find(); // Adjust this query based on your database schema

    if (!publications || publications.length === 0) {
      console.error('No publications found');
      return res.status(404).json({ error: 'No publications found' });
    }

    console.log('Publications retrieved successfully');
    res.json(publications);
  } catch (err) {
    console.error('Error fetching publications:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.handleUpload = async (files, data) => {
  try {
    // Process uploaded files and data
    console.log('Uploaded files:', files);
    console.log('Additional data:', data);

    // Example: save files to database or file system
    const filePaths = files.map(file => file.path);

    // Return a response or perform other actions as needed
    return { message: 'Upload successful', files: filePaths };
  } catch (error) {
    console.error('Error handling upload:', error);
    throw new Error('Failed to handle upload');
  }
};


