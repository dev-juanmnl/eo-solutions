const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  const truncatedText = text.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(" ");

  return truncatedText.slice(0, lastSpaceIndex) + "...";
};

const cleanHtmlTagsFromText = (text: string) => {
  return text.replace(/<[^>]*>?/gm, ""); // Remove HTML tags
};

export { truncateText, cleanHtmlTagsFromText };
