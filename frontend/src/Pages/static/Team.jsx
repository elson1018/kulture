import React from 'react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import tanChinQian from '../../assets/team/chinqian.png'
import chongHanZheng from '../../assets/team/hanzheng.png'
import elsonOoi from '../../assets/team/elson.jpg'
import lauJunHao from '../../assets/team/junhao.jpg'
import './Team.css'

const teamMembers = [
    {
        id: 1,
        name: "Tan Chin Qian",
        title: "Founder & CEO",
        photo: tanChinQian,
        linkedin: "https://www.linkedin.com/in/tan-chin-qian-5146641b5"
    },
    {
        id: 2,
        name: "Chong Han Zheng",
        title: "Co-Founder & CTO",
        photo: chongHanZheng,
        linkedin: "https://www.linkedin.com/in/chong-han-zheng-8bb613339"
    },
    {
        id: 3,
        name: "Elson Ooi",
        title: "Lead Developer",
        photo: elsonOoi,
        linkedin: "https://www.linkedin.com/in/elson-ooi-yin-feng-666005314"
    },
    {
        id: 4,
        name: "Lau Jun Hao",
        title: "Marketing Director",
        photo: lauJunHao,
        linkedin: "https://www.linkedin.com/in/jun-hao-lau-8874a6276"
    }
]

const Team = () => {
    useDocumentTitle('Our Team | Kulture');
    return (
        <div className='team-page'>
            <header className="team-header">
                <h1>Meet Our Team</h1>
                <h3>The passionate people behind Kulture, working together to create something special</h3>
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
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="linkedin-link"
                            >
                                View Our LinkedIn
                            </a>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    )
}

export default Team