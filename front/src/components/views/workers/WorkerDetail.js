import React, { Component } from 'react'
import { getProfileFetch } from '../../../actions'
import { connect } from 'react-redux'
import {
  CForm,
  CFormGroup,
  CInput,
  CLabel, CRow,
  CCol,
  CButton,
  CLink,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle
} from "@coreui/react";
import DjangoCSRFToken from 'django-react-csrftoken'
import { FoxApiService } from '../../../services'
import { FoxFormGroupInputDownloadUpload, FoxSelectFormGroup, FoxReactSelectFormGroup, FoxFormGroupDownloadUpload } from '../../forms'
import { positions, tradeCompetencies } from './optionLists'
import { DeleteModal } from '../../modals'

const foxApi = new FoxApiService();

class WorkerDetail extends Component {

  state = {
    modal: false,
    name: "",
    phone_number: "",
    contractor: "",
    birthday: "",
    card_number_id: "",
    license_number: "",
    license_scan: "",
    passport: "",
    passport_scan: "",
    safety_green_card: "",
    safety_green_card_scan: "",
    position_in_company: "",
    safety_quiz_answer: "",
    personal_declaration: "",
    registration_number: "",
    error: false,
    filename: "",
    doc_type: "",
    upload_files: {}
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleFileUpload = event => {
    const { upload_files } = this.state;
    upload_files[event.target.name] = event.target.files[0];
    this.setState({
      upload_files: upload_files,
      [event.target.name]: ""
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.requestData = this.state;
    const { upload_files } = this.requestData
    delete this.requestData.modal
    delete this.requestData.upload_files
    delete this.requestData.error;
    delete this.requestData.filename;
    delete this.requestData.doc_type;
    delete this.requestData.license_scan;
    delete this.requestData.passport_scan;
    delete this.requestData.safety_green_card_scan;
    delete this.requestData.safety_quiz_answer;
    delete this.requestData.personal_declaration;
    this.formData = new FormData
    Object.entries(this.requestData).forEach(([key, value]) => {
      this.formData.append(key, value);
    });
    upload_files ? Object.entries(upload_files).forEach(([key, value]) => {
      this.formData.append(key, value)
    }) : null;
    await foxApi.patchEntityWithFiles('workers', this.props.match.params.id, this.formData)
      .then(() => {
        this.props.history.goBack()
      },
        (error) => {
          console.error(error);
          this.setState({
            error: 'Worker update failed!' +
              ' Please check your input and try again!' +
              ' In case this problem repeats, please contact your administrator!'
          })
        })
  }

  confirmDelete = async () => {
    await foxApi.deleteEntityOf('workers', this.props.match.params.id)
      .then(() => {
        this.props.history.goBack()
      },
        (error) => {
          console.error(error);
          this.setState({
            error: 'Could not delete worker!' +
              ' Please check your input and try again!' +
              ' In case this problem repeats, please contact your administrator!'
          })
        })
  }

  downloadFile = async (e) => {
    this.setState({
      filename: e.target.value,
      doc_type: e.target.name
    }
      , () => {
        foxApi.downloadWorkerDocument(this.props.match.params.id, this.state.doc_type)
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            const filename = this.state.filename.split('/').pop();
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((error) => {
            console.error('File download failed!');
            console.error(error)
          })
      }
    )
  }

  setModalVisibility = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  componentDidMount = async () => {
    await this.props.getProfileFetch()
      .then(() => foxApi.getDetailsOf('workers', this.props.match.params.id))
      .then((data) => this.setState({ ...data }))
  }

  render = () => {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <CCardTitle>
                Worker Detail
              </CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CForm
                onSubmit={this.handleSubmit}
              >
                <DjangoCSRFToken />
                <CFormGroup>
                  <CLabel htmlFor="name">Name</CLabel>
                  <CInput
                    id="name"
                    name='name'
                    placeholder="Enter worker name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    required />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="birthday">Birthday</CLabel>
                  <CInput
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={this.state.birthday}
                    onChange={this.handleChange}
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="phone_number">Phone number</CLabel>
                  <CInput
                    id="phone_number"
                    name='phone_number'
                    placeholder="Enter phone number"
                    value={this.state.phone_number}
                    onChange={this.handleChange}
                    required />
                </CFormGroup>
                <FoxReactSelectFormGroup
                  options={positions}
                  inputInfo="position_in_company"
                  inputValue={this.state.position_in_company}
                  handleChange={this.handleReactSelect}
                />
                <FoxSelectFormGroup
                  options={tradeCompetencies}
                  inputInfo="trade_competency"
                  inputValue={this.state.trade_competency}
                  handleChange={this.handleChange}
                />
                <CFormGroup>
                  <CLabel htmlFor="card_number_id">Card number ID</CLabel>
                  <CInput
                    id="card_number_id"
                    name='card_number_id'
                    placeholder="Enter ID"
                    value={this.state.card_number_id}
                    onChange={this.handleChange}
                    required />
                </CFormGroup>
                <FoxFormGroupInputDownloadUpload
                  inputValue={this.state.license_number}
                  downloadValue={this.state.license_scan}
                  handleChange={this.handleChange}
                  handleFileUpload={this.handleFileUpload}
                  inputInfo="license_number"
                  uploadInfo="license_scan"
                  downloadFile={this.downloadFile}
                />
                <FoxFormGroupInputDownloadUpload
                  inputValue={this.state.passport}
                  downloadValue={this.state.passport_scan}
                  handleChange={this.handleChange}
                  handleFileUpload={this.handleFileUpload}
                  inputInfo="passport"
                  uploadInfo="passport_scan"
                  downloadFile={this.downloadFile}
                />
                <FoxFormGroupInputDownloadUpload
                  inputValue={this.state.safety_green_card}
                  downloadValue={this.state.safety_green_card_scan}
                  handleChange={this.handleChange}
                  handleFileUpload={this.handleFileUpload}
                  inputInfo="safety_green_card"
                  uploadInfo="safety_green_card_scan"
                  downloadFile={this.downloadFile}
                />
                <CFormGroup>
                  <CLabel htmlFor="registration_number">Registration number</CLabel>
                  <CInput
                    id="registration_number"
                    name='registration_number'
                    placeholder="Enter registration number"
                    value={this.state.registration_number}
                    onChange={this.handleChange}
                  />
                </CFormGroup>
                <FoxFormGroupDownloadUpload
                  inputValue={this.state.safety_quiz_answer}
                  downloadValue={this.state.safety_quiz_answer_scan}
                  handleChange={this.handleChange}
                  handleFileUpload={this.handleFileUpload}
                  inputInfo="safety_quiz_answer"
                  uploadInfo="safety_quiz_answer_scan"
                  downloadFile={this.downloadFile}
                />
                <FoxFormGroupDownloadUpload
                  inputValue={this.state.personal_declaration}
                  downloadValue={this.state.personal_declaration_scan}
                  handleChange={this.handleChange}
                  handleFileUpload={this.handleFileUpload}
                  inputInfo="personal_declaration"
                  uploadInfo="personal_declaration_scan"
                  downloadFile={this.downloadFile}
                />
                <CFormGroup>
                  <CLink className="btn btn-outline-primary" to={`/workers/${this.props.match.params.id}/competencies`}>Special Competencies</CLink>
                </CFormGroup>
                <CFormGroup>
                  <CButton shape="pill" type="submit" color="dark" variant="outline" block>Save changes</CButton>
                </CFormGroup>
                <CButton shape="pill" color="danger" variant="outline" onClick={this.setModalVisibility} block>Delete Worker</CButton>
                {this.state.error
                  ? <p>{this.state.error}</p>
                  : null
                }
              </CForm>
            </CCardBody>
          </CCard>

          <DeleteModal
            setModalVisibility={this.setModalVisibility}
            danger={this.state.modal}
            entity="worker"
            confirmDelete={this.confirmDelete}
          />
        </CCol>
      </CRow >
    )
  }
}

const mapStateToProps = state => {
  return {
    contractor: state.currentUser.id,
  }
}

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkerDetail)
