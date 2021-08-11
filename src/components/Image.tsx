import Image from 'next/image'

const Img = ({
    src,
    width,
    height,
    alt
}: {
    src: string;
    width: string;
    height: string;
    alt?: string;
}): JSX.Element =>
    (
        <Image
            src={src}
            sizes={"50vw"}
            quality={"100"}
            width={width}
            height={height}
            layout={"responsive"}
            alt={!alt ? "image" : alt}
            unoptimized={false} />
    );

export default Img
