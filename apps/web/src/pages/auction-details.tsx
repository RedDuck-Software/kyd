import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function AuctionDetails() {
  let { id } = useParams();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold">{id} Auction Details</h1>
        <p className="text-sm">
          {id} Auction long description lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa doloribus
          accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam saepe a
          ipsam distinctio sunt.lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore ipsa doloribus
          accusantium eius nam cum natus perspiciatis. Alias, ratione numquam! Quod, ducimus id eaque totam saepe a
          ipsam distinctio sunt.
        </p>
      </div>
      <div className="flex justify-center w-full mt-4">
        <Swiper
          spaceBetween={32}
          slidesPerView={3}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <div className="flex justify-center bg-slate-500 h-[200px] items-center">Slide 1</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex justify-center bg-slate-500 h-[200px] items-center">Slide 2</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex justify-center bg-slate-500 h-[200px] items-center">Slide 3</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex justify-center bg-slate-500 h-[200px] items-center">Slide 4</div>
          </SwiperSlide>
          ...
        </Swiper>
      </div>
    </div>
  );
}
