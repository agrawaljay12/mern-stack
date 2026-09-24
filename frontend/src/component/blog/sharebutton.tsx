import { useState } from "react";

interface ShareButtonProps {
  title: string;
}

const ShareButton = ({
  title,
}: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2000
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-200"
    >
      {copied ? "Link copied!" : "Share"}
    </button>
  );
};

export default ShareButton;