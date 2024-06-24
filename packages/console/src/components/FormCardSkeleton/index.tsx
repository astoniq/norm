import {FormCardLayout} from "../FormCardLayout";
import  styles from './index.module.css';
import {Shimmering} from "../Shimmering";

type Props = {
    readonly formFieldCount?: number;
};

function Skeleton({ formFieldCount = 4 }: Props) {
    return (
        <FormCardLayout
            introduction={
                <>
                    <Shimmering className={styles.title} />
                    <div>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <Shimmering key={index} className={styles.text} />
                        ))}
                    </div>
                </>
            }
        >
            {Array.from({ length: formFieldCount }).map((_, index) => (
                <Shimmering key={index} className={styles.field} />
            ))}
        </FormCardLayout>
    );
}

export default Skeleton;