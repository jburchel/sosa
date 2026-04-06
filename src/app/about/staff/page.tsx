import type { Metadata } from 'next';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Staff | SOSA Basketball',
  description:
    'Meet the dedicated coaches and directors behind SOSA Basketball — the team that builds champions on and off the court.',
};

const STAFF: { name: string; role: string; image: string; objectPosition?: string }[] = [
  {
    name: 'Linwood Chappell Jr.',
    role: 'Head Coach SOSA N9NE',
    image: '/images/staff/linwood_chappell.JPG',
  },
  {
    name: 'John Hull Jr.',
    role: 'SOSA Director / Head Coach SOSA Lady Tigers',
    image: '/images/staff/john_hull.JPG',
  },
  {
    name: 'Brandon Jones',
    role: 'Assistant Coach SOSA 7EVEN',
    image: '/images/staff/brandon_jones.JPEG',
  },
  {
    name: 'Matt Munger',
    role: 'Head Coach SOSA ATE Developmental / Assistant Coach SOSA ATE Competitive',
    image: '/images/staff/matt_munger.JPG',
  },
  {
    name: 'Javier Pacheco',
    role: 'Head Coach SOSA 7VEN Developmental / Assistant Coach SOSA 7EVEN Competitive',
    image: '/images/staff/janier_pacheco.JPEG',
  },
  {
    name: 'Verna Spivey',
    role: 'SOSA Community Outreach Director / Secretary',
    image: '/images/staff/verna_spivey.jpg',
  },
  {
    name: 'Darnell Williams',
    role: 'SOSA Director / Head Coach SOSA ATE Competitive / Assistant Coach SOSA ATE Developmental',
    image: '/images/staff/darnell_williams.JPG',
    objectPosition: 'center',
  },
  {
    name: 'Stephanie Williams',
    role: 'SOSA Treasurer / Assistant Coach SOSA Lady Tigers',
    image: '/images/staff/stephanie_williams.JPG',
  },
];

export default function StaffPage() {
  return (
    <div className="bg-black text-white">
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Staff"
            subtitle="Meet the coaches and directors who make SOSA Basketball possible."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {STAFF.map((member) => (
              <div
                key={member.name}
                className="group bg-sosa-dark rounded-xl overflow-hidden border border-sosa-gray hover:border-sosa-orange transition-colors duration-300"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: member.objectPosition || 'top' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold uppercase tracking-wide">
                    {member.name}
                  </h3>
                  <div className="w-8 h-0.5 bg-sosa-orange my-2" />
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
