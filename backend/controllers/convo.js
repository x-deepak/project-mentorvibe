// Add this function to your conversation-related service or controller





async function updateMentorStudentCount(mentorId, studentId) {
    try {
      // 1. Find all conversations involving this mentor
      const existingConversations = await Conversation.find({
        'participants': {
          $elemMatch: {
            'id': mentorId,
            'role': 'Mentor'
          }
        }
      });
      
      // 2. Check if this student has had a conversation with this mentor before
      const hasExistingConversation = existingConversations.some(conversation => {
        return conversation.participants.some(participant => 
          participant.role === 'User' && participant.id.toString() === studentId.toString()
        );
      });
      
      // 3. If this is a new student for this mentor, increment the count
      if (!hasExistingConversation) {
        await Mentor.findByIdAndUpdate(
          mentorId,
          { $inc: { studentCount: 1 } },
          { new: true }
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error updating mentor student count:', error);
      throw error;
    }
  }
  
  // Example usage when creating a new conversation
  async function createConversation(mentorId, studentId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create the conversation
      const newConversation = new Conversation({
        participants: [
          { id: mentorId, role: 'Mentor' },
          { id: studentId, role: 'User' }
        ],
        isActive: true
      });
      
      await newConversation.save({ session });
      
      // Update the mentor's student count
      await updateMentorStudentCount(mentorId, studentId);
      
      await session.commitTransaction();
      return newConversation;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error creating conversation:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  module.exports = { updateMentorStudentCount, createConversation };