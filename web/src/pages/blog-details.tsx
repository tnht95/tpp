import { Comment, CommentForm, OptionButton } from '@/components';

export const BlogDetails = () => (
  <div class="w-4/6 my-10">
    <div class="border rounded-xl ml-20 px-10 py-7 flex flex-col gap-7 mb-10">
      <div>
        <div class="flex items-center justify-between">
          <p class="text-3xl font-bold">This is the title</p>
          <OptionButton id="post1" isOwner={true} enableDelete />
        </div>
        <p class="text-base text-gray-400">26 Sep 2011</p>
      </div>
      <p class="text-xl text-gray-600">
        Track work across the enterprise through an open, collaborative
        platform. Link issues across Jira and ingest data from other software
        development tools, so your IT support and operations teams have richer
        contextual information to rapidly respond to requests, incidents, and
        changes.
      </p>
      <img
        src="https://www.adorama.com/alc/wp-content/uploads/2018/11/landscape-photography-tips-yosemite-valley-feature.jpg"
        alt="img"
      />
      <p class="text-lg">
        Photography is the result of combining several technical discoveries,
        relating to seeing an image and capturing the image. The discovery of
        the camera obscura ("dark chamber" in Latin) that provides an image of a
        scene dates back to ancient China. Greek mathematicians Aristotle and
        Euclid independently described a camera obscura in the 5th and 4th
        centuries BCE.[11][12] In the 6th century CE, Byzantine mathematician
        Anthemius of Tralles used a type of camera obscura in his
        experiments.[13] The Arab physicist Ibn al-Haytham (Alhazen) (965–1040)
        also invented a camera obscura as well as the first true pinhole
        camera.[12][14][15] The invention of the camera has been traced back to
        the work of Ibn al-Haytham.[16] While the effects of a single light
        passing through a pinhole had been described earlier,[16] Ibn al-Haytham
        gave the first correct analysis of the camera obscura,[17] including the
        first geometrical and quantitative descriptions of the phenomenon,[18]
        and was the first to use a screen in a dark room so that an image from
        one side of a hole in the surface could be projected onto a screen on
        the other side.[19] He also first understood the relationship between
        the focal point and the pinhole,[20] and performed early experiments
        with afterimages, laying the foundations for the invention of
        photography in the 19th century.[15] Leonardo da Vinci mentions natural
        camerae obscurae that are formed by dark caves on the edge of a sunlit
        valley. A hole in the cave wall will act as a pinhole camera and project
        a laterally reversed, upside down image on a piece of paper. Renaissance
        painters used the camera obscura which, in fact, gives the optical
        rendering in color that dominates Western Art. It is a box with a small
        hole in one side, which allows specific light rays to enter, projecting
        an inverted image onto a viewing screen or paper. The birth of
        photography was then concerned with inventing means to capture and keep
        the image produced by the camera obscura. Albertus Magnus (1193–1280)
        discovered silver nitrate,[21] and Georg Fabricius (1516–1571)
        discovered silver chloride,[22] and the techniques described in Ibn
        al-Haytham's Book of Optics are capable of producing primitive
        photographs using medieval materials.[citation needed] Daniele Barbaro
        described a diaphragm in 1566.[23] Wilhelm Homberg described how light
        darkened some chemicals (photochemical effect) in 1694.[24] The fiction
        book Giphantie, published in 1760, by French author Tiphaigne de la
        Roche, described what can be interpreted as photography.[23] In June
        1802, British inventor Thomas Wedgwood made the first known attempt to
        capture the image in a camera obscura by means of a light-sensitive
        substance.[25] He used paper or white leather treated with silver
        nitrate. Although he succeeded in capturing the shadows of objects
        placed on the surface in direct sunlight, and even made shadow copies of
        paintings on glass, it was reported in 1802 that "the images formed by
        means of a camera obscura have been found too faint to produce, in any
        moderate time, an effect upon the nitrate of silver." The shadow images
        eventually darkened all over.[26]
      </p>
    </div>

    <div class="ml-8 flex flex-col gap-5">
      <Comment
        id="c111"
        user="Harry@yahoo.com"
        date="15 Jan 2014"
        likeNumber={1}
        liked={false}
      />
      <Comment
        id="c211"
        user="Harry@yahoo.com"
        date="15 Jan 2014"
        likeNumber={1}
        liked={false}
      />

      <Comment
        id="c311"
        user="Harry@yahoo.com"
        date="15 Jan 2014"
        likeNumber={1}
        liked={false}
      />
      <Comment
        id="c151"
        user="Harry@yahoo.com"
        date="15 Jan 2014"
        likeNumber={1}
        liked={true}
      />
    </div>
    <div class="ml-20 mt-10">
      <CommentForm>New Comment</CommentForm>
    </div>
  </div>
);
