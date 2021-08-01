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
import Image from "next/image";
import {
  ArrowLeftMinor,
  OrdersMajor,
  HomeMajor,
  ReplaceMajor,
  CirclePlusOutlineMinor,
} from "@shopify/polaris-icons";

export default function Index() {
  const defaultState = useRef({
    emailFieldValue: "dharma@jadedpixel.com",
    nameFieldValue: "Jaded Pixel",
  });
  const skipToContentRef = useRef(null);

  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState(
    defaultState.current.nameFieldValue
  );

  const [storeName, setStoreName] = useState(
    defaultState.current.nameFieldValue
  );

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );
  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    []
  );

  const handleSearchResultsDismiss = useCallback(() => {
    setSearchActive(false);
    setSearchValue("");
  }, []);

  const handleSearchFieldChange = useCallback((value) => {
    setSearchValue(value);
    setSearchActive(value.length > 0);
  }, []);

  const userMenuActions = [
    {
      items: [{ content: "Community forums" }],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="Dharma"
      detail={storeName}
      initials="D"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const searchResultsMarkup = (
    <ActionList
      items={[
        { content: "Shopify help center" },
        { content: "Community forums" },
      ]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchFieldChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: "Back to Shopify",
            icon: ArrowLeftMinor,
            onClick: () => console.log("Hello"),
          },
        ]}
      />
      <Navigation.Section
        separator
        title="Product Option"
        items={[
          {
            label: "Image",
            icon: HomeMajor,
            onClick: () => console.log(""),
          },
          {
            url: "/image",
            label: "Orders",
            icon: OrdersMajor,
            secondaryAction: {
              url: "/image",
              accessibilityLabel: "Add an order",
              icon: CirclePlusOutlineMinor,
            },
          },
          {
            label: "Reload",
            icon: OrdersMajor,
            onClick: toggleIsLoading,
          },
        ]}
        action={{
          icon: ReplaceMajor,
          accessibilityLabel: "Contact support",
          onClick: () => console.log(""),
        }}
      />
    </Navigation>
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  const actualPageMarkup = (
    <Page>
      <Layout>
        {skipToContentTarget}
        <Layout.Section oneHalf>
          <Image src="#" width={400} height={400} alt="Black choker necklace" />
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card sectioned>
            <Form>
              <FormLayout>
                <DisplayText size="extraLarge">God Ring</DisplayText>
                <Subheading element="h2">$2000</Subheading>
                <DisplayText size="small">Good evening, Dominic.</DisplayText>
                <Select
                  label="Date range"
                  options={[
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "Last 7 days", value: "lastWeek" },
                  ]}
                  onChange={() => console.log("")}
                  value="today"
                />
                <DisplayText size="small">Good evening, Dominic.</DisplayText>
                <Checkbox
                  label="Basic checkbox"
                  checked={true}
                  onChange={() => console.log("")}
                />
                <ButtonGroup>
                  <Button></Button>
                  <Button></Button>
                </ButtonGroup>
                <DisplayText size="small">Button</DisplayText>
                <ButtonGroup segmented>
                  <Button>Bold</Button>
                  <Button>Italic</Button>
                  <Button>Underline</Button>
                </ButtonGroup>
                <TextField
                  label="TextField"
                  value="Text Field"
                  onChange={() => console.log("")}
                />
                <TextField
                  label="MultiTextField"
                  value="Line1\nLine2\nLine3"
                  onChange={() => console.log("")}
                  multiline={4}
                />
                <DropZone onDrop={null}>
                  <DropZone.FileUpload />
                </DropZone>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );

  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

  const theme = {
    logo: {
      width: 124,
      topBarSource: "https://cdn.cdnlogo.com/logos/l/95/ledger.svg",
      contextualSaveBarSource: "https://cdn.cdnlogo.com/logos/l/95/ledger.svg",
      url: "https://google.com/",
      accessibilityLabel: "Teams Options",
    },
  };

  return (
    <div>
      <AppProvider
        theme={theme}
        i18n={{
          Polaris: {
            Avatar: {
              label: "Avatar",
              labelWithInitials: "Avatar with initials {initials}",
            },
            ContextualSaveBar: {
              save: "Save",
              discard: "Discard",
            },
            TextField: {
              characterCount: "{count} characters",
            },
            TopBar: {
              toggleMenuLabel: "Toggle menu",

              SearchField: {
                clearButtonLabel: "Clear",
                search: "Search",
              },
            },
            Modal: {
              iFrameTitle: "body markup",
            },
            Frame: {
              skipToContent: "Skip to content",
              navigationLabel: "Navigation",
              Navigation: {
                closeMobileNavigationLabel: "Close navigation",
              },
            },
          },
        }}
      >
        <Frame
          topBar={topBarMarkup}
          navigation={navigationMarkup}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
        >
          {loadingMarkup}
          {pageMarkup}
        </Frame>
      </AppProvider>
    </div>
  );
}
