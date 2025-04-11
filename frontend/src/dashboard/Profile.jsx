import React from 'react';

const Profile = () => {
  // A simple profile object for demonstration
  const mentorProfile = {
    name: 'John Doe',
    expertise: 'React Developer',
    bio: 'Experienced React developer with 5+ years in the industry.',
    email: 'john.doe@example.com'
  };

  return (
    <div className="profile">
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {mentorProfile.name}</p>
      <p><strong>Expertise:</strong> {mentorProfile.expertise}</p>
      <p><strong>Bio:</strong> {mentorProfile.bio}</p>
      <p><strong>Email:</strong> {mentorProfile.email}</p>
    </div>
  );
};

export default Profile;