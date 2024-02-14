import { mergeProps } from 'solid-js';

type Props = {
  img?: string;
  userId?: number;
};

export const Avatar = (p: Props) => {
  const props = mergeProps(
    {
      img: 'https://i.pinimg.com/originals/78/ca/78/78ca785082be660b6e9d37850ddfb272.jpg'
    },
    p
  );
  return (
    <a target="_blank" class="contents" href={`/users/${props.userId}`}>
      <img class="size-10 rounded-full" src={props.img} alt="Rounded avatar" />
    </a>
  );
};
