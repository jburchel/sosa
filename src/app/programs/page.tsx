import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Programs | SOSA Basketball',
  description:
    'Explore SOSA Basketball programs — travel teams, skills training, mentorship, and community outreach for youth athletes.',
};

const PROGRAM_DETAILS = [
  {
    title: 'Travel Basketball Teams',
    icon: '🏀',
    description: `SOSA fields competitive AAU travel teams for boys and girls across multiple age groups, giving young athletes the opportunity to compete at the highest local and regional levels. Our travel program exposes players to quality competition through organized tournament schedules, allowing them to measure their growth against top programs from across the state and region. Beyond wins and losses, our travel program is about building resilient, coachable athletes who understand the value of preparation, teamwork, and accountability. Players develop lifelong bonds with teammates while representing SOSA with pride, sportsmanship, and a championship mindset.`,
    accent: 'border-sosa-orange',
    highlight: 'text-sosa-orange',
    image: { src: '/images/boys-game-action-3.png', alt: 'Boys Tigers game action — dunk and layup' },
  },
  {
    title: 'Basketball Skills Training',
    icon: '🎯',
    description: `Our structured skills training program is designed to build players from the ground up — whether a beginner learning the basics or a seasoned athlete sharpening their edge. Sessions focus on fundamental ball handling, footwork, shooting mechanics, and defensive positioning. Players progress through condition-specific drills that build strength, agility, and court awareness. Game IQ is a core emphasis: we teach athletes how to read defenses, make smart decisions under pressure, and elevate their floor game. Training is led by experienced coaches who tailor development to each athlete's current skill level and goals, ensuring every player walks away improving every session.`,
    accent: 'border-sosa-orange',
    highlight: 'text-sosa-orange',
    image: { src: '/images/practice-action.jpg', alt: 'Players training in orange uniforms on indoor court' },
  },
  {
    title: 'Mentorship & Leadership',
    icon: '🌟',
    description: `SOSA believes that developing a great athlete means developing a great person first. Our mentorship and leadership program pairs young athletes with positive adult role models who are invested in their success — on and off the court. We hold players to high academic standards, checking grades, encouraging study habits, and celebrating academic achievement alongside athletic accomplishment. Character-building workshops and team discussions help players develop the soft skills they'll need throughout life: communication, integrity, conflict resolution, and emotional intelligence. We equip youth not just to lead on the court, but to lead in their schools, families, and communities.`,
    accent: 'border-sosa-orange',
    highlight: 'text-sosa-orange',
    image: { src: '/images/player-portrait.png', alt: 'Teen player in SOSA orange and black jersey' },
  },
  {
    title: 'Community Outreach',
    icon: '🤝',
    description: `Giving back is not an afterthought at SOSA — it is a core pillar of who we are. Our athletes participate in organized community service projects, local events, and initiatives that teach them the power and responsibility of contributing to the community around them. From food drives and neighborhood cleanups to visits with youth at local schools, SOSA players learn that their presence and effort can make a real difference. Community outreach instills humility, gratitude, and social responsibility, while reminding our athletes that they are part of something bigger than basketball. We are building village leaders, not just student-athletes.`,
    accent: 'border-sosa-orange',
    highlight: 'text-sosa-orange',
    image: { src: '/images/community.jpg', alt: 'SOSA community event' },
  },
];

export default function ProgramsPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Programs"
            subtitle="Every program at SOSA is designed to develop the whole athlete — mind, body, and character."
          />
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          {PROGRAM_DETAILS.map((program, index) => (
            <div
              key={program.title}
              className={`bg-sosa-gray rounded-2xl border-l-4 ${program.accent} p-8 hover:bg-sosa-dark transition-colors duration-300`}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-start`}>
                {/* Image */}
                <div className="w-full lg:w-80 flex-shrink-0 rounded-xl overflow-hidden aspect-video lg:aspect-square relative">
                  <Image
                    src={program.image.src}
                    alt={program.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                </div>
                {/* Text */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl" aria-hidden="true">{program.icon}</span>
                    <h3 className={`text-2xl font-bold ${program.highlight}`}>{program.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg">{program.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Join?</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            We&apos;d love to have your athlete be part of the SOSA family. Reach out to learn more
            about registration, tryouts, and upcoming seasons.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-sosa-orange text-black font-bold uppercase tracking-wide px-10 py-4 rounded-full hover:opacity-90 transition-opacity duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}
