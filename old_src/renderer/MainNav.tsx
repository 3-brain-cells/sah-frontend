import React, { useContext } from "react";
import styled from "@emotion/styled";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  FaDiscord,
  FaTwitter,
  FaInfoCircle,
  FaRobot,
  FaPalette,
} from "react-icons/fa";
import { IoMdSettings, IoSend } from "react-icons/io";
import { RiShoppingCartFill } from "react-icons/ri";
import { ImCreditCard } from "react-icons/im";
import { MdVpnKey } from "react-icons/md";

import NavItem from "./NavItem";
import { AboutModalContext } from "./_lib/modal_contexts";
import CollapseButton from "./CollapseButton";
import { colors } from "./_lib/colors";
import KairosLogo from "./KairosLogo";
import NavTime from "./NavTime";
import BaseNavSocial from "./NavSocial";
import {
  topLevelNavCollapsedWidth,
  topLevelNavExpandedWidth,
} from "./_lib/layout";
import { durations, easings } from "./_lib/motion";
import { isDesignSystemPageEnabled } from "../pages/DesignSystemPage/DesignSystemPage";

const twitterURL = "https://twitter.com/unahbSZN/";
const discordURL = "https://discord.com/invite/wvYVUfZj3r";

const NavSocial = styled(BaseNavSocial)``;
const Styled = {
  NavSocial,
  Nav: styled.nav`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    white-space: nowrap;
    background-color: ${colors.background10};
    overflow: hidden;
    transition: width ${durations.medium} ${easings.ease};
    margin-top: -16px;

    &[data-open] {
      width: ${topLevelNavExpandedWidth};
    }

    &:not([data-open]) {
      width: ${topLevelNavCollapsedWidth};
    }

    & > * {
      flex-shrink: 0;
    }
  `,
  Toolbar: styled.div`
    margin-top: 8px;
    margin-left: 12px;
    margin-bottom: 28px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    transition: margin-left ${durations.medium} ${easings.ease};

    &[data-collapsed] {
      flex-direction: column;
      align-items: flex-start;
      margin-left: 8px;

      /* Hide nav social icons on collapsed, short windows */

      @media screen and (max-height: 600px) {
        margin-top: 16px;

        ${NavSocial} {
          display: none;
        }
      }
    }

    &:not([data-collapsed]) {
      & a {
        margin-bottom: 0 !important;
      }
    }

    & > * {
      flex-shrink: 0;
    }
  `,
  CollapseButton: styled(CollapseButton)`
    z-index: 3;

    &::after {
      box-shadow: -26px 0px 32px 16px rgba(0, 0, 0, 0.15) !important;
    }
  `,
  ButtonContainer: styled.div`
    display: flex;
    flex-grow: 1;
    flex-shrink: 1 !important;
    flex-direction: column;

    overflow-y: auto;
    overflow-x: hidden;

    & > * {
      flex-shrink: 0;
    }

    /* Hide the scrollbars on the button container */
    &::-webkit-scrollbar {
      display: none;
    }
  `,
};

export type MainNavProps = {
  className?: string;
  style?: React.CSSProperties;
};

function MainNav({
  history,
  location,
  className,
  style,
}: MainNavProps & RouteComponentProps): React.ReactElement {
  const [open, setOpen] = React.useState(true);
  const { showAboutModal, setShowAboutModal } = useContext(AboutModalContext);

  const loc = location.pathname;
  const navClickHandler = (path: string) => () => {
    if (loc !== path) history.push(path);
  };

  return (
    <Styled.Nav
      data-open={open ? true : undefined}
      className={className}
      style={style}
    >
      <KairosLogo open={open} />
      <NavTime open={open} />

      <Styled.ButtonContainer>
        <NavItem
          open={open}
          onClick={navClickHandler("/releases")}
          selected={loc.startsWith("/releases")}
          label="Releases"
          icon={<RiShoppingCartFill />}
        />
        <NavItem
          open={open}
          onClick={navClickHandler("/profile_groups")}
          selected={loc.startsWith("/profile_groups")}
          label="Profiles"
          icon={<ImCreditCard />}
        />
        <NavItem
          open={open}
          onClick={navClickHandler("/proxy_lists")}
          selected={loc.startsWith("/proxy_lists")}
          label="Proxies"
          icon={<IoSend />}
        />
        <NavItem
          open={open}
          onClick={navClickHandler("/accounts")}
          selected={loc.startsWith("/accounts")}
          label="Accounts"
          icon={<MdVpnKey />}
        />
        <NavItem
          open={open}
          onClick={navClickHandler("/captchas")}
          selected={loc.startsWith("/captchas")}
          label="Captchas"
          icon={<FaRobot />}
        />
        {isDesignSystemPageEnabled && (
          <NavItem
            open={open}
            onClick={navClickHandler("/design_system")}
            selected={loc.startsWith("/design_system")}
            label="Components"
            icon={<FaPalette />}
          />
        )}
        <span style={{ marginTop: "auto" }} />
        <NavItem
          open={open}
          onClick={() => setShowAboutModal(true)}
          selected={showAboutModal}
          label="About"
          icon={<FaInfoCircle />}
        />
        <NavItem
          open={open}
          onClick={navClickHandler("/settings")}
          selected={loc === "/settings"}
          label="Settings"
          icon={<IoMdSettings />}
        />
      </Styled.ButtonContainer>

      <Styled.Toolbar data-collapsed={!open ? true : undefined}>
        <Styled.NavSocial icon={<FaTwitter />} link={twitterURL} />
        <Styled.NavSocial icon={<FaDiscord />} link={discordURL} />
        <Styled.CollapseButton onClick={() => setOpen(!open)} isOpen={open} />
      </Styled.Toolbar>
    </Styled.Nav>
  );
}

export default withRouter(MainNav);
