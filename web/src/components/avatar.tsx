import { createSignal } from 'solid-js';

type AvatarProp = {
  img?: string;
};
export const Avatar = (props: AvatarProp) => {
  const [imgUrl] = createSignal(
    props.img ||
      'https://i.pinimg.com/originals/78/ca/78/78ca785082be660b6e9d37850ddfb272.jpg'
  );
  return (
    <img class="size-10 rounded-full" src={imgUrl()} alt="Rounded avatar" />
  );
};
