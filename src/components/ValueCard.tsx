interface ValueCardProps {
  name: string;
  description: string;
}

export default function ValueCard({ name, description }: ValueCardProps) {
  return (
    <div className="text-center px-4 py-6">
      <p className="text-white font-bold uppercase tracking-widest text-sm mb-3">{name}</p>
      <div className="w-8 h-1 bg-sosa-orange mx-auto mb-3 rounded" />
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
