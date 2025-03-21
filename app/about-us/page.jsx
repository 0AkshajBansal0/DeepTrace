<<<<<<< HEAD
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function MeetOurTeam() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <TeamMember 
          name="Priyanshu Vasudev" 
          role="Developer" 
          imgSrc="/images/priyanshu photo.jpg" 
          linkedin="https://linkedin.com/in/priyanshu" 
          github="https://github.com/priyanshu"
        />
        <TeamMember 
          name="Jay Jariwala" 
          role="Designer" 
          imgSrc="/images/jay.jpg" 
          linkedin="https://linkedin.com/in/jay" 
          github="https://github.com/jay"
        />
        <TeamMember 
          name="Akshaj Bansal" 
          role="AI Engineer" 
          imgSrc="/images/Akshaj.jpg" 
          linkedin="https://linkedin.com/in/akshaj" 
          github="https://github.com/akshaj"
        />
        <TeamMember 
          name="Tanmay Bansal" 
          role="Developer" 
          imgSrc="/images/tanmay.jpg" 
          linkedin="https://linkedin.com/in/tanmay" 
          github="https://github.com/tanmay170"
        />
      </div>
    </div>
  );
}

function TeamMember({ name, role, imgSrc, linkedin, github }) {
  return (
    <div className="group relative flex flex-col items-center text-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 w-64 lg:w-72 mx-auto">
      
      {/* Profile Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary shadow-md">
        <Image src={imgSrc} alt={name} width={128} height={128} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Name & Role */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{role}</p>

      {/* Social Icons */}
      <div className="flex space-x-4">
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition">
          <FaLinkedin size={24} />
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition hover:cursor-pointer">
          <FaGithub size={24} />
        </a>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
}
=======
import Image from "next/image";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function MeetOurTeam() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <TeamMember 
          name="Priyanshu Vasudev" 
          role="Developer" 
          imgSrc="/images/priyanshu photo.jpg" 
          linkedin="https://linkedin.com/in/priyanshu" 
          github="https://github.com/priyanshu"
        />
        <TeamMember 
          name="Jay Jariwala" 
          role="Designer" 
          imgSrc="/images/jay.jpg" 
          linkedin="https://linkedin.com/in/jay" 
          github="https://github.com/jay"
        />
        <TeamMember 
          name="Akshaj Bansal" 
          role="AI Engineer" 
          imgSrc="/images/Akshaj.jpg" 
          linkedin="https://linkedin.com/in/akshaj" 
          github="https://github.com/akshaj"
        />
        <TeamMember 
          name="Tanmay Bansal" 
          role="Developer" 
          imgSrc="/images/tanmay.jpg" 
          linkedin="https://linkedin.com/in/tanmay" 
          github="https://github.com/tanmay170"
        />
      </div>
    </div>
  );
}

function TeamMember({ name, role, imgSrc, linkedin, github }) {
  return (
    <div className="group relative flex flex-col items-center text-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 w-64 lg:w-72 mx-auto">
      
      {/* Profile Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary shadow-md">
        <Image src={imgSrc} alt={name} width={128} height={128} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Name & Role */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{role}</p>

      {/* Social Icons */}
      <div className="flex space-x-4">
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition">
          <FaLinkedin size={24} />
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition hover:cursor-pointer">
          <FaGithub size={24} />
        </a>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
}
>>>>>>> 19e632201042bbf322f81e4f0b346e7666171f55
