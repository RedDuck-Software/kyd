import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { AuctionParticipants } from '@/components/auction/auction-participants';
import { AuctionDonate } from '@/components/auction/auction-donate';
import { ShadowCard } from '@/components/common/shadow-card';
import { getShadowCardVariant } from '@/lib/shadow-card-variant';
import { AuctionProgress } from '@/components/auction/auction-progress';

export default function AuctionDetails() {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">{id} Auction Details</h1>
          <p className="text-base">
            {id} Auction long description lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa
            doloribus accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam
            saepe a ipsam distinctio sunt.lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa
            doloribus accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam
            saepe a ipsam distinctio sunt.
          </p>
        </div>
        <div className="flex justify-center w-full mt-4">
          <Swiper
            spaceBetween={32}
            slidesPerView={3}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <SwiperSlide className="">
                <ShadowCard variant={getShadowCardVariant(i)}>
                  <div className="flex justify-center  h-[200px] items-center">Slide {i + 1}</div>
                </ShadowCard>
              </SwiperSlide>
            ))}
            ...
          </Swiper>
        </div>
      </div>
      <AuctionProgress />
      <AuctionDonate />
      <AuctionParticipants />
    </div>
  );
}
