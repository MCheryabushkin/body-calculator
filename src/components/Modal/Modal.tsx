import React from "react";

import * as S from "./Modal.scss";

interface ModalProps {
    content: any;
    onClose: () => void;
}

export default class Modal extends React.Component<ModalProps, {}> {

    onClose = () => {
        this.props.onClose();
    }

    render() {
        const {content} = this.props;

        return (
            <div className={S.root}>
                <div className={S.modal}>
                    <div className={S.modalHeader}>
                        <button className={S.close} onClick={this.onClose}></button>
                    </div>
                    <div className={S.modalContent}>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}