import React from 'react'
import photo_img from '../assets/people.png'
import '../CSS/Team.css'

const teamMembers = [
    {id: 1, name: "Tan Chin Qian", title: "Founder", bio: "I love Kulture", photo: photo_img},
    {id: 2, name: "Chong Han Zheng", title: "unknown", bio: "I love Kulture", photo: photo_img},
    {id: 3, name: "Elson Ooi", title: "unknown", bio: "I love Kulture", photo: photo_img},
    {id: 4, name: "Sadona Lau", title: "unknown", bio: "I love Kulture", photo: photo_img}
]

const Team = () => {
  return (
    <div className='team-page'>
        <header className="team-header">
            <h1>Meet Our Team</h1>
            <h3>We are a group</h3>
        </header>
        
        <main className="team-grid">
            {teamMembers.map((member) => (
                <div key={member.id} className="team-card">
                    <div className="team-photo-wrapper">
                        <img src={member.photo} alt={member.name} className="team-photo" />
                    </div>

                    <div className="team-info">
                        <h3>{member.name}</h3>
                        <h4>{member.title}</h4>
                        <p>{member.bio}</p>
                    </div>
                </div>
            ))}
        </main>
    </div>
  )
}

export default Team