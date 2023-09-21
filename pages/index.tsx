import { NextPage } from "next/types";
import React, { useState } from "react";
import { appDispatch, appSelector } from "@/store/hooks";
import Header from "@/components/Header";

import EmblaCarousel from "@/components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel-react";

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 1;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

function Index() {
  return (
    <div className="wrapper">
      {/* <Header /> */}
      <section className="carousel">
        {/* <section className="sandbox__carousel">
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </section> */}
      </section>
      <div>index</div>
    </div>
  );
}

export default Index;
