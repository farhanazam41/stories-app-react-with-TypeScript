import { memo } from "react";
const List = ({ items, removeStory }) => {
  return (
    <>
      {items.map((item) => {
        return (
          <div key={item.objectID}>
            <p>{item.title}</p>
            <button onClick={() => removeStory(item.objectID)}>
              Remove Story
            </button>
          </div>
        );
      })}
    </>
  );
};

export default memo(List);
