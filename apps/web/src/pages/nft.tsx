import { ShadowCard } from '@/components/common/shadow-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import useModalsStore from '@/store/modals-store';
import { useState } from 'react';

export default function Nft() {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const { setNftAlertModalOpen } = useModalsStore();
  return (
    <div className="flex flex-col gap-8">
      <Dialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <DialogContent>
          <div className="flex items-center justify-center"></div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center">
        <ShadowCard variant={'blue'} className="overflow-hidden">
          <img
            src="https://forklog.com.ua/wp-content/uploads/2023/08/Snimok-ekrana-2023-08-23-v-12.14.48.webp"
            alt=""
            className="rounded-[16px] w-full max-w-[600px] "
          />
        </ShadowCard>
      </div>
      <h1 className="text-4xl text-center font-semibold">BAYC #2255</h1>

      <p className="text-base font-medium">SOme info about company</p>
      <p className="text-base">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nulla maiores accusantium harum quae, vitae,
        eveniet natus vero nesciunt, corporis iure illum cum consequatur animi. Quod officiis at voluptates blanditiis.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut error tempora maiores ex dicta itaque laborum
        ducimus cumque eos ab ratione exercitationem, quam id laboriosam? Eveniet repudiandae eum quas, sed, ut est vel
        reiciendis nihil temporibus quaerat culpa ab! Illo iusto aliquam minus odio suscipit voluptatibus nisi dolorem
        ullam totam neque alias tempora harum nesciunt corrupti similique eligendi, architecto culpa impedit aut, magnam
        tenetur, aperiam voluptate. Fugiat doloremque porro architecto placeat officia incidunt debitis aliquam? Animi
        rerum consequuntur, veritatis fuga, nobis unde voluptatibus accusantium non inventore velit debitis corrupti!
        Nihil ad soluta optio dicta tenetur iste at itaque perspiciatis provident, exercitationem fuga, nisi natus cum
        laudantium suscipit quia in sint ex tempora asperiores laboriosam. Optio necessitatibus reiciendis quas dolor
        labore corporis eligendi illo libero odit inventore fuga perferendis fugit, distinctio porro architecto quae,
        eaque ipsam totam voluptas cumque ab, dolorum quos cum excepturi. Eveniet optio quos perferendis natus
        voluptatem ipsam molestiae vero animi sit maxime corrupti dolore ab quam delectus laborum consectetur qui, quo
        aperiam libero autem enim obcaecati, unde rem in? Quis sapiente ullam, quae blanditiis voluptate quibusdam
        distinctio eligendi suscipit consequuntur? Aliquam officia quas et sequi ducimus harum. Vel doloremque ullam
        mollitia vitae atque, assumenda animi inventore maiores fugit aperiam. Deleniti aliquid amet sequi voluptate
        cum, nulla harum ad eligendi quidem odio voluptates eius illo praesentium sunt architecto delectus corporis rem
        repellat laborum odit itaque culpa veritatis eos similique? Dolore, voluptas velit sit error quidem
        reprehenderit doloribus consequuntur optio ipsa nostrum impedit dignissimos possimus delectus repellat sequi
        inventore maxime! Sapiente pariatur tempora quidem animi veritatis at perspiciatis, dolorem unde consectetur?
        Dolorum dolores omnis quo ipsa distinctio beatae fugit laborum rerum est! Nisi omnis veniam vero mollitia,
        ratione sit, impedit quas harum architecto, quidem obcaecati incidunt ad expedita velit. Debitis iste totam
        harum a doloremque, ducimus libero dolore natus!
      </p>
      <Button onClick={() => setNftAlertModalOpen(true)} className="py-3 text-[18px]">
        Redeem
      </Button>
    </div>
  );
}
