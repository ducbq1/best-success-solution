import { Autocomplete, TextContainer, Stack, Tag } from "@shopify/polaris";
import React, { useState, useCallback, useContext } from "react";
import { StoreContexts } from "../contexts/store-contexts";

export default function Products(props) {
  const { idsContext, ...rest } = useContext(StoreContexts);
  const [ids, setIds] = idsContext;
  const deselectedOptions = props.data;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      let endIndex = resultOptions.length - 1;
      if (resultOptions.length === 0) {
        endIndex = 0;
      }
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      placeholder="Products..."
    />
  );

  return (
    <>
      <Autocomplete
        allowMultiple
        options={options}
        textField={textField}
        selected={selectedOptions}
        onSelect={(value) => {
          setSelectedOptions(value);
          setIds(value.map((item) => item[2]));
        }}
        listTitle="Suggested Tags"
      />
    </>
  );
}
