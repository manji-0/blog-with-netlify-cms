import Image from 'next/image'

const Img = ({
    src,
    alt,
}: {
    src: string;
    alt: string;
}): JSX.Element =>
    (
        <Image
            src={src}
            sizes={"50vw"}
            quality={"100"}
            width={"100%"}
            height={"100%"}
            layout={"responsive"}
            alt={alt}
            unoptimized={false} />
    );

export default Img
