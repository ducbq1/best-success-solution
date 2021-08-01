import {
  Select,
  Form,
  FormLayout,
  TextField,
  InlineError,
} from "@shopify/polaris";
import React, { useState, useCallback } from "react";

const validatePriority = (value) => {
  if (value >= 0 && value <= 99) return true;
  return false;
};

const validateName = (value) => {
  return /^[A-Za-z\s]+$/.test(value);
};

export default function GeneralInformation() {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState("enable");
  const [focus, setFocus] = useState(false);

  const handleSubmit = useCallback((_event) => {
    setName("");
    setPriority(0);
    setStatus("enable");
  }, []);

  const handleNameChange = useCallback((value) => setName(value), []);

  const handlePriorityChange = useCallback((value) => setPriority(value), []);

  const handleStatusChange = useCallback((value) => setStatus(value), []);

  const statusOption = [
    { label: "Disable", value: "disable" },
    { label: "Enable", value: "enable" },
  ];

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={name}
          onChange={handleNameChange}
          label="Name"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {focus && !validateName(name) && (
          <InlineError message="Invalid name" fieldID="nameID" />
        )}
        <TextField
          value={priority}
          onChange={handlePriorityChange}
          label="Priority"
          type="number"
          helpText={
            <span>
              Please enter an integer from 0 to 99. 0 is the highest priority.
            </span>
          }
        />
        {!validatePriority(priority) && (
          <InlineError message="Out of range priority" fieldID="priorityID" />
        )}
        <Select
          label="Status"
          options={statusOption}
          onChange={handleStatusChange}
          value={status}
        />
      </FormLayout>
    </Form>
  );
}
