import {
  SkeletonDisplayText,
  Frame,
  AppProvider,
  TopBar,
  Modal,
  Form,
  FormLayout,
  TextField,
  SkeletonPage,
  Layout,
  Card,
  Page,
  Navigation,
  ActionList,
  ContextualSaveBar,
  TextContainer,
  SkeletonBodyText,
  Loading,
  Thumbnail,
  DisplayText,
  Select,
  Checkbox,
  Button,
  ButtonGroup,
  Subheading,
  DropZone,
} from "@shopify/polaris";
import React, { useRef, useState, useCallback } from "react";
import {
  ArrowLeftMinor,
  OrdersMajor,
  HomeMajor,
  ReplaceMajor,
  CirclePlusOutlineMinor,
} from "@shopify/polaris-icons";

export default function Home() {
  return (
    <Page>
      <DisplayText size="small">Good evening, Dominic.</DisplayText>
    </Page>
  );
}

// export async function getStaticProps() {
//   return {
//     props: {
//       host: "hahaa"
//     }
//   }
// }
