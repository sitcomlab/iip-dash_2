// from https://github.com/Roschl/react-leaflet-custom-layer-control-ts/tree/main/src

import { LeafletProvider, useLeafletContext } from '@react-leaflet/core';
import { Layer } from 'leaflet';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ReactNode } from 'react';
import { useLayerControlContext } from './layerControlContext.js';
import { useMap } from 'react-leaflet';

const createControlledLayer = (
  addLayerToControl
) => {
  function ControlledLayer(props) {
    var context = useLeafletContext();
    const layerContext = useLayerControlContext();
    const propsRef = useRef(props);
    //console.log('propsRef.Icon', propsRef.current.icon)
    const parentMap = useMap();

    const [layer, setLayer] = useState(null);
    //console.log('layer', layer)

    const addLayer = useCallback(
      (layerToAdd) => {
        if (propsRef.current.checked) {
          parentMap.addLayer(layerToAdd);
        }

        addLayerToControl(
          layerContext,
          layerToAdd,
          propsRef.current.name,
          propsRef.current.group,
          propsRef.current.icon
        );
        setLayer(layerToAdd);
      },
      [layerContext, parentMap]
    );

    const removeLayer = useCallback(
      (layerToRemove) => {
        context.layersControl?.removeLayer(layerToRemove);
        setLayer(null);
      },
      [context]
    );

    const newContext = useMemo(() => {
      return context
        ? Object.assign({}, context, {
            layerContainer: {
              addLayer,
              removeLayer,
            },
          })
        : null;
    }, [context, addLayer, removeLayer]);

    useEffect(() => {
      if (layer !== null && propsRef.current !== props) {
        if (
          props.checked === true &&
          (propsRef.current.checked == null ||
            propsRef.current.checked === false)
        ) {
          parentMap.addLayer(layer);
        } else if (
          propsRef.current.checked === true &&
          (props.checked == null || props.checked === false)
        ) {
          parentMap.removeLayer(layer);
        }

        propsRef.current = props;
      }

      return () => {
        if (layer !== null) {
          //context.layersControl = context.layersControl?.removeLayer(layer);
          context.layersControl?.removeLayer(layer) //OK why is this working and not the above, and what exactly am i breaking with this?
        }
      };
    });

    return props.children
      ? React.createElement(
          LeafletProvider,
          {
            value: newContext,
          },
          props.children
        )
      : null;
  }

  return ControlledLayer;
};

export default createControlledLayer;
