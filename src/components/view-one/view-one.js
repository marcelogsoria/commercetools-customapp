import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import messages from "./messages";
import ReactFlow from "react-flow-renderer";
import Text from "@commercetools-uikit/text";
import { useApplicationContext } from "@commercetools-frontend/application-shell-connectors";

import fetchStatesData from "../../actions/states";

const ViewOne = ({ fetchStatesData }) => {
  const addNodeIfNotExists = (newNode, nodeCollection = []) => {
    const foundNode = nodeCollection.filter((node) => node.id === newNode.id);
    if (foundNode.length === 0) {
      nodeCollection.push(newNode);
      return true;
    } else {
      return false;
    }
  };
  const [nodeCollection, setNodeCollection] = useState([]);

  const elements = [
    {
      id: "1",
      type: "input", // input node
      data: { label: "Input Node" },
      position: { x: 250, y: 25 },
    },
    // default node
    {
      id: "2",
      // you can also pass a React component as a label
      data: { label: <div>Default Node</div> },
      position: { x: 100, y: 125 },
    },
    {
      id: "3",
      type: "output", // output node
      data: { label: "Output Node" },
      position: { x: 250, y: 250 },
    },
    // animated edge
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3" },
  ];
  /*   const projectKey = useApplicationContext((context) => context.project.key);
   */

  useEffect(() => {
    const fetchImportSinksData = async () => {
      const results = await fetchStatesData();
      console.log(results);
      let filteredResults = results.results.filter(
        (state) => state.type === "LineItemState"
      );
      console.log(filteredResults);

      let returnedNodes = [];
      let initialX = 250;
      let currentX = initialX;
      let currentY = 25;
      let xPadding = 200;
      let yPadding = 70;
      results.results.forEach((elem) => {
        addNodeIfNotExists(
          {
            id: elem.id,
            type: "input", // input node
            data: { label: elem.key },
            position: { x: currentX, y: currentY },
          },
          returnedNodes
        );
        currentY += yPadding;
        currentX = initialX;
        if (elem.transitions) {
          elem.transitions.forEach((trans) => {
            let destNode = results.results.filter(
              (node) => node.id === trans.id
            );
            destNode = destNode.length > 0 ? destNode[0] : null;
            if (
              addNodeIfNotExists(
                {
                  id: trans.id,
                  type: "input", // input node
                  data: { label: destNode?.key },
                  position: { x: currentX, y: currentY },
                },
                returnedNodes
              )
            ) {
              currentX += xPadding;
            }

            returnedNodes.push({
              id: "e" + elem.id + "-" + trans.id,
              source: elem.id,
              target: trans.id,
            });
          });
        }
      });
      console.log("returnedNodes", returnedNodes);
      setNodeCollection(returnedNodes);
      //dispatch({ type: "SET_IMPORT_SINKS", importSinksData: results });
    };
    fetchImportSinksData();
  }, []);
  return (
    <>
      {/*       <div style={{ height: 300 }}>
        <ReactFlow elements={elements} />
      </div> */}
      <Text.Body intlMessage={messages.title} />;
      {nodeCollection?.length > 0 && (
        <div style={{ height: 5000 }}>
          <ReactFlow elements={nodeCollection} />
        </div>
      )}
    </>
  );
};
ViewOne.displayName = "ViewOne";

export default connect(null, {
  fetchStatesData,
})(ViewOne);
