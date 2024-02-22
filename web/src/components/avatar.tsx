type Props = {
  img: string;
  userId?: number;
};

export const Avatar = (props: Props) => (
  <a class="contents" href={`/users/${props.userId}`}>
    <img class="size-10 rounded-full" src={props.img} alt="Rounded avatar" />
  </a>
);
