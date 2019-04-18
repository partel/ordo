import React from "react";
import {withTranslation} from "react-i18next";

const LandingPage = ({t}) => <div>{t("landing:Landing page title")}</div>;

export default withTranslation()(LandingPage);
