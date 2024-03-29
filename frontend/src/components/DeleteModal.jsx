import React from 'react'
import { useTranslation } from 'react-i18next';

const DeleteModal = ({ onDeleteField, fieldType, fieldIndex }) => {
    const [t, i18n] = useTranslation()
    const handleContinue = (event) => {
        event.preventDefault()
        onDeleteField(event, fieldType, fieldIndex)
      };
  return (
    <div className="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">{t('deleteModal.title')}</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">{t('deleteModal.confirmation')}</div>
                <div className="modal-footer d-flex justify-content-between">
                    <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleContinue}>{t('buttons.continue')}</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">{t('buttons.cancel')}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteModal