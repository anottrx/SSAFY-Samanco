import React, { useState } from "react";

function LinkList({ items }) {
  //   const [links, setLinks] = useState([]);
  //   setLinks(items.split(" "));

  return (
    <>
      {items != null ? (
        <div>
          {items.map((item, index) => {
            return (
              <a href={item} target="_blank" key={index}>
                {item}&nbsp;
              </a>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default LinkList;
