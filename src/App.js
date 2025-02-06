import React, { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { FiFilePlus } from "react-icons/fi";
import { RiFolderAddLine } from "react-icons/ri";
import FolderStructure from "./components/FolderStructure";
import "./App.css";
import { findAndUpdateNode } from "./components/commonFunctions";

const generateId = () => `node-${Date.now()}-${Math.random()}`;

// Sample tree data
const initialTreeData = {
  value: "EVALUATION",
  type: "folder",
  id: "root",
  children: [
    {
      value: "Documents",
      type: "folder",
      id: "Documents",
      children: [
        { value: "Document1.jpg", type: "file", id: "Document1", children: [] },
        { value: "Document2.jpg", type: "file", id: "Document2", children: [] },
        { value: "Document3.jpg", type: "file", id: "Document3", children: [] },
      ],
    },
    {
      value: "Desktop",
      type: "folder",
      id: "desktop",
      children: [
        { value: "Screenshot1.jpg", type: "file", id: "screenshot1", children: [] },
        { value: "videopal.mp4", type: "file", id: "videopal", children: [] },
      ],
    },
    {
      value: "Downloads",
      type: "folder",
      id: "downloads",
      children: [
        {
          value: "Drivers",
          type: "folder",
          id: "drivers",
          children: [
            { value: "Printerdriver.dmg", type: "file", id: "printerdriver", children: [] },
            { value: "cameradriver.dmg", type: "file", id: "cameradriver", children: [] },
          ],
        },
      ],
    },
    { value: "chromedriver.dmg", type: "file", id: "chromedriver", children: [] },
  ],
};

const App = () => {
  const [treeData, setTreeData] = useState(initialTreeData);
  const [warning, setWarning] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [fileToggle, setFileToggle] = useState(true);

  // Check if a name already exists in children
  const isNameExists = (children, name) =>
    children?.some((child) => child.value === name);

  // Update node logic
  const updateNode = (node, newValue, type) => {
    if (isNameExists(node.children, newValue)) {
      setWarning("A file or folder cannot have the same name at the same location!");
    } else {
      node.children.push({
        value: newValue,
        type,
        id: generateId(),
        children: type === "folder" ? [] : undefined,
      });
    }
  };

  // Handle adding a new file/folder
  const handleAddChild = (parentId, newValue, type) => {
    if (!parentId) {
      setWarning("Please select a folder before adding.");
      return;
    }

    setTreeData((prevTree) => {
      const newTree = { ...prevTree };
      findAndUpdateNode(newTree, parentId, false, null, (node) => {
        if (node.type !== "folder") {
          setWarning("Cannot add inside a file!");
          return;
        }
        updateNode(node, newValue, type);
      });
      return newTree;
    });
  };

  // Handle updating a node's value
  const handleUpdateNode = (parentNode, id, newValue) => {
    if (isNameExists(parentNode.children, newValue)) {
      // setWarning("A file or folder cannot have the same name at the same location!");
      return;
    }

    setTreeData((prevTree) => {
      const newTree = { ...prevTree };
      findAndUpdateNode(newTree, id, false, null, (node) => {
        node.value = newValue;
      });
      return newTree;
    });
  };
  
  // Delete node
const handleDeleteNode = (id) => {
  setTreeData((prevTree) => {
    const newTree = { ...prevTree };

    const deleteNodeById = (parentNode, idToDelete) => {
      const index = parentNode.children.findIndex((child) => child.id === idToDelete);
      if (index !== -1) {
        parentNode.children.splice(index, 1); // Remove the child node
        return true;
      }
      for (let child of parentNode.children) {
        if (deleteNodeById(child, idToDelete)) {
          return true; // Continue searching in child nodes if needed
        }
      }
      return false;
    };

    deleteNodeById(newTree, id); // Initiate deletion process starting from root
    return newTree;
  });
};


  return (
    <div className="main">
      <div style={{ maxWidth: "300px", padding: "10px 0", margin: "auto" }}>
        <div className="flex-center">
          <div
            onClick={() => setFileToggle(!fileToggle)}
            className="flex-center"
          >
            <IoIosArrowUp
              style={{ transform: fileToggle ? "rotate(180deg)" : "rotate(90deg)" }}
              size={22}
            />
            <span style={{ fontWeight: "700" }}>{treeData.value.toUpperCase()}</span>
          </div>
          <div className="flex-center">
            <FiFilePlus
              className="icon-pointer"
              onClick={() => handleAddChild(selectedId.id, "newFile.txt", "file")}
            />
            <RiFolderAddLine
              className="icon-pointer"
              onClick={() => handleAddChild(selectedId.id, "newFolder", "folder")}
            />
          </div>
        </div>

        <div className="structure-layout">
          {warning && (
            <div
              style={{
                marginLeft: "30px",
                color: "orange",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {warning}
            </div>
          )}
          {fileToggle &&
            treeData.children?.map((child) => (
              <FolderStructure
                key={child.id}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                parentNode={treeData}
                node={child}
                onAdd={handleAddChild}
                onUpdate={handleUpdateNode}
                onDelete={handleDeleteNode}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;

