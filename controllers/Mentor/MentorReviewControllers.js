

const { Testimonial, User, Mentor,Review } = require('../../models');

const { Sequelize } = require('sequelize');

const ratingValues = {
  feltHeard: {
    'Yes, definitely': 3,
    'Somewhat': 2,
    'Not really': 1,
  },
  mentorKnowledge: {
    'Very knowledgeable': 4,
    'Fairly knowledgeable': 3,
    'Not sure': 2,
    'Not at all': 1,
  },
  rightIssue: {
    'Yes, it felt aligned with what I need': 3,
    'Not exactly — I hoped to focus on something else': 2,
    'Not sure': 1,
  },
  communicationRating: {
    'Excellent': 4,
    'Good': 3,
    'Could be better': 2,
    'Poor': 1,
  },
};

exports.submitReview = async (req, res) => {
  try {
    const {
      mentorId,
      userId,
      sessionRating, // 1-5
      feltHeard,
      mentorKnowledge,
      rightIssue,
      communicationRating,
      feedback,
      sessionId,
      data_of_session
    } = req.body;
    const total =sessionRating+ratingValues.feltHeard[feltHeard]+ratingValues.mentorKnowledge[mentorKnowledge]+ratingValues.rightIssue[rightIssue]+
                 ratingValues.communicationRating[communicationRating]
    const averageScore=total/5;
    const newReview = await Review.create({
      mentorId,
      userId,
      sessionRating,
      feltHeard: ratingValues.feltHeard[feltHeard],
      mentorKnowledge: ratingValues.mentorKnowledge[mentorKnowledge],
      rightIssue: ratingValues.rightIssue[rightIssue],
      communicationRating: ratingValues.communicationRating[communicationRating],
      feedback,
      averageScore,
      sessionId,
      data_of_session
    });
    return res.status(201).json({ message: 'Review submitted successfully', data: newReview });
  } catch (error) {
    console.error('Submit Review Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


exports.createOrUpdateTestimonial = async (req, res) => {
  try {
    const { userId, mentorId, content } = req.body;

    if (!userId || !mentorId || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [testimonial, created] = await Testimonial.findOrCreate({
      where: { userId, mentorId },
      defaults: { content }
    });

    if (!created) {
      testimonial.content = content;
      await testimonial.save();
    }

    return res.status(200).json({
      message: created ? 'Testimonial created' : 'Testimonial updated',
      data: testimonial
    });

  } catch (error) {
    console.error('Error creating/updating testimonial:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all testimonials for a mentor
exports.getMentorTestimonials = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const testimonials = await Testimonial.findAll({
      where: { mentorId },
      include: [{ model: User, attributes: ['firstname', 'lastname'] }]
    });

    return res.status(200).json({ data: testimonials });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



