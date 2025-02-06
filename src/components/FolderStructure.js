import { useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import "./fileStructure.css";

const FolderStructure = ({ selectedId, setSelectedId, parentNode, node, onAdd, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(node.value);

  const updateNode = (id, value) => {
    onUpdate(parentNode.children, id, value);
    setEditing(false);
  };

  return (
    <div className="node-container">
      <div className={`node-header ${selectedId.id === node.id ? "selected" : ""}`}>
        {node.type === "file" ? (
          <FaFileAlt color="gray" />
        ) : (
          <IoIosArrowUp
            className={`toggle-icon ${expanded ? "open" : "closed"}`}
            onClick={() => {
              setSelectedId({ id: node.id, type: node.type });
              setExpanded(!expanded);
            }}
          />
        )}

        {editing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateNode(node.id, inputValue)}
          />
        ) : (
          <button
            className="node-button"
            onClick={() => setSelectedId({ id: node.id, type: node.type })}
            onDoubleClick={() => setEditing(true)}
          >
            {node.value}
          </button>
        )}

        {/* Add Delete Button */}
        <button className="delete-button" onClick={() => onDelete(node.id)}>
          Delete
        </button>
      </div>

      {expanded && node.children?.map((child) => (
        <FolderStructure 
          key={child.id}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          parentNode={node}
          node={child}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FolderStructure;



