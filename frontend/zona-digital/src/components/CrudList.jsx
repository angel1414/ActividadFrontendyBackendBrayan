import React from "react";

const CrudList = ({ items, renderItem }) => {
  if (!Array.isArray(items)) {
    console.warn(" Error: 'items' no es un array", items);
    return <p>No hay datos registrados.</p>;
  }

  if (items.length === 0) {
    return <p>No hay datos registrados.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

export default CrudList;
