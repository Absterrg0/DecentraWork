import { cn } from "@/lib/utils";
import {
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Built for freelancers",
      description:
        "Freelancer marketplace without any fees",
      icon: <IconTerminal2 />,
    },
    {
      title: "Ease of use",
      description:
        "It is as easy as a high school maths paper",
      icon: <IconEaseInOut />,
    },
    {
      title: "Pricing like no other",
      description:
        "No fees charged from freelancer",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <IconCloud />,
    },
    {
      title: "Lowest fees",
      description: "The fees after submitting a project is lowest in marketplace",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Real-time chat support",
      description:
        "Freelancer and client can easily talk through real time chats in house",
      icon: <IconHelp />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 3) && "lg:border-l dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-60 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-indigo-100 dark:from-indigo-800 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-60 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-indigo-100 dark:from-indigo-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-indigo-400 dark:bg-indigo-600 group-hover/feature:bg-indigo-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-500 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};