import BackArrow from "@/assets/svgs/arrowback";
import GlossaryTag from "@/assets/svgs/glossaryTag";
import { slugify } from "@/lib/utils";

export const TopicCard = ({
  topic,
  onClick,
}: {
  topic: {
    title: string;
    course: string;
    number_of_quizzes: number;
  };
  onClick: () => void;
}) => (
  <div
    className="bg-white px-4 py-6 rounded-[20px] cursor-pointer hover:bg-gray-5 flex gap-3 items-center"
    onClick={onClick}
  >
    <span className="p-3 rounded-full bg-primaryBlue/10">
      <GlossaryTag />
    </span>
    <div>
      <h3 className="text-lg font-medium">{topic.title}</h3>
      <div className="flex gap-2 items-center">
        <p className="text-xs text-textSubtitle">{topic.course}</p>
        <span className="p-0.5 bg-textSubtitle/50 rounded-full" />
        <p className="text-xs text-textSubtitle">
          {topic.number_of_quizzes} Resource
          {topic.number_of_quizzes > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  </div>
);

export const TopicDetail = ({
  topic,
  onClose,
}: {
  topic: {
    title: string;
    course: string;
    number_of_quizzes: number;
  };
  onClose: () => void;
}) => {
  const videos = Array.from({ length: topic.number_of_quizzes }, (_, i) => ({
    title: `${topic.title} - Part ${i + 1}`,
    link: `/dashboard/${slugify(topic.course)}/${slugify(topic.title)}`,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <button
        onClick={onClose}
        className="text-sm text-primaryBlue flex items-center gap-1 mb-6"
      >
        <BackArrow />
      </button>
      <table className="w-full text-left">
        <thead className="bg-white text-center">
          <tr className="text-sm text-textSubtitle">
            <th className="pl-4 py-3 text-left font-medium text-textGray">
              SECTION
            </th>
            <th className="py-3 font-medium text-textGray">VIDEOS</th>
            <th className="py-3 font-medium text-textGray">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, idx) => (
            <tr key={idx} className="text-sm text-center border-b">
              {idx === 0 && (
                <td
                  className="py-4 px-3 font-semibold uppercase text-left text-textGray text-base md:text-lg align-middle w-1/4"
                  rowSpan={videos.length}
                >
                  {topic.title}
                </td>
              )}
              <td className="py-4 px-3 border-l text-textGray font-medium">
                {video.title}
              </td>
              <td className="py-4 px-3 border-l">
                <a href={video.link} className="text-primaryBlue font-medium">
                  Watch
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
