import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import fetchStatesData from '../../actions/states';
import ReactFlow from 'react-flow-renderer';
import SelectInput from '@commercetools-uikit/select-input';
import Text from '@commercetools-uikit/text';

import messages from './messages';
import styles from './view-one.mod.css';

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
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [statesData, setStatesData] = useState([]);

  const handleChangeSelectedEntity = (event) => {
    setSelectedEntity(event.target.value);
  };

  useEffect(() => {
    if (selectedEntity) {
      let filteredResults = statesData.filter(
        (state) => state.type === selectedEntity,
      );
      console.log(filteredResults);

      let returnedNodes = [];
      let initialX = 250;
      let currentX = initialX;
      let currentY = 25;
      let xPadding = 200;
      let yPadding = 70;
      filteredResults.forEach((elem) => {
        addNodeIfNotExists(
          {
            id: elem.id,
            //type: 'input',
            data: { label: elem.key },
            position: { x: currentX, y: currentY },
          },
          returnedNodes,
        );
        currentY += yPadding;
        currentX = initialX;
        if (elem.transitions) {
          elem.transitions.forEach((trans) => {
            let destNode = filteredResults.filter(
              (node) => node.id === trans.id,
            );
            destNode = destNode.length > 0 ? destNode[0] : null;
            if (
              addNodeIfNotExists(
                {
                  id: trans.id,
                  //type: 'input', // input node
                  data: { label: destNode?.key },
                  position: { x: currentX, y: currentY },
                },
                returnedNodes,
              )
            ) {
              currentX += xPadding;
            }

            returnedNodes.push({
              id: 'e' + elem.id + '-' + trans.id,
              source: elem.id,
              target: trans.id,
              arrowHeadType: 'arrowclosed',
              animated: true,
            });
          });
        }
      });
      console.log('returnedNodes', returnedNodes);
      setNodeCollection(returnedNodes);
    }
  }, [selectedEntity]);
  useEffect(() => {
    const fetchStates = async () => {
      const results = await fetchStatesData();

      console.log('results', results);
      let returnedTypesSet = new Set();
      results?.results?.forEach((state) => returnedTypesSet.add(state.type));
      let returnedTypesArray = Array.from(returnedTypesSet);
      console.log('returnedTypesArray', returnedTypesArray);
      setEntities(returnedTypesArray);
      setStatesData(results.results);
    };
    fetchStates();
  }, []);
  return (
    <>
      <Text.Body intlMessage={messages.title} />
      <SelectInput
        name="entity-selector"
        value={selectedEntity}
        onChange={handleChangeSelectedEntity}
        options={entities.map((entity) => ({ value: entity, label: entity }))}
      />
      <div className={styles['diagram-container']}>
        {nodeCollection?.length > 0 && (
          <div style={{ height: 5000 }}>
            <ReactFlow elements={nodeCollection} />
          </div>
        )}
      </div>
    </>
  );
};
ViewOne.displayName = 'ViewOne';

export default connect(null, {
  fetchStatesData,
})(ViewOne);
