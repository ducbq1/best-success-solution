import { Autocomplete, TextContainer, Stack, Tag } from "@shopify/polaris";
import React, { useState, useCallback, useContext } from "react";
import { StoreContexts } from "../contexts/store-contexts";

export default function ProductTags(props) {
  const { productsTagsContext, ...rest } = useContext(StoreContexts);
  const [productsTags, setProductsTags] = productsTagsContext;
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

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
      setProductsTags(options);
    },
    [selectedOptions]
  );

  const tagsMarkup = selectedOptions.map((option) => {
    let tagLabel = "";
    tagLabel = option.replace("_", " ");
    tagLabel = titleCase(tagLabel);
    return (
      <Tag key={`option${option}`} onRemove={removeTag(option)}>
        {tagLabel}
      </Tag>
    );
  });

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      placeholder="Vintage, cotton, summer"
    />
  );

  return (
    <>
      <Autocomplete
        actionBefore={{
          active: true,
          content: "Add tag",
          icon: "placeholder",
          onAction: () => <div></div>,
        }}
        allowMultiple
        options={options}
        selected={selectedOptions}
        textField={textField}
        onSelect={(value) => {
          setSelectedOptions(value);
          setProductsTags(value);
        }}
        listTitle="Suggested Tags"
      />
      <br />
      <TextContainer>
        <Stack>{tagsMarkup}</Stack>
      </TextContainer>
    </>
  );

  function titleCase(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join("");
  }
}
