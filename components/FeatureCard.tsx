import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    gradient?: string;
    delay?: number;
}

export function FeatureCard({
    icon,
    title,
    description,
    gradient = "from-primary-800 to-primary-900",
    delay = 0
}: FeatureCardProps) {
    return (
        <div
            className={`feature-card group animate-slide-up`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Icon container */}
            <div className={`
        w-14 h-14 rounded-xl mb-4
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        group-hover:scale-110 transition-transform duration-300
        shadow-lg
      `}>
                <span className="text-2xl">{icon}</span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary-400 transition-colors">
                {title}
            </h3>
            <p className="text-white/60 leading-relaxed">
                {description}
            </p>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
        </div>
    );
}
