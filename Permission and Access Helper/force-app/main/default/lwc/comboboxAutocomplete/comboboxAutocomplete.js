import { LightningElement, api, track } from 'lwc';

export default class ComboboxAutocomplete extends LightningElement {

    @api classes;
    @api label;
    @api placeholder;
    @api value;
    @api
    get options() {
        return this.storedAllOptions;
    }

    set options(data) {
        this.filteredOptions = data;
        this.storedAllOptions = data;
    }

    @track isFocussed = false;
    @track isOpen = false;

    storedAllOptions = [];
    filteredOptions = [];
    domElement;

    _handleOutsideClick;

    constructor() {
        super();
        this._handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    connectedCallback() {
        this.filteredOptions = [...this.options];
        document.addEventListener('click', this._handleOutsideClick);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._handleOutsideClick);
    }

    filterOptions(event) {
        const filterText = event.detail.value;
        if (filterText === '') {
            this.filteredOptions = this.options;
            return;
        }
        this.filteredOptions = this.options.filter(option => {
            return option.label.toLowerCase().includes(filterText.toLowerCase());
        });
    }

    handleSelectOption(event) {
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.value = event.currentTarget.dataset.label;
        const custEvent = new CustomEvent(
            'selectoption', {
            detail: {
                value: event.currentTarget.dataset.value,
                label: event.currentTarget.dataset.label
            }
        }
        );
        this.dispatchEvent(custEvent);

        // Close the picklist options
        this.isFocussed = false;
        this.isOpen = false;
    }

    get noOptions() {
        return this.filteredOptions.length === 0;
    }

    get dropdownClasses() {

        let dropdownClasses = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';

        // Show dropdown list on focus
        if (this.isOpen) {
            dropdownClasses += ' slds-is-open';
        }

        return dropdownClasses;
    }

    handleOutsideClick(event) {

        if ((!this.isFocussed) && (this.isOpen)) {

            //Fetch the dropdown DOM node
            let domElement = this.template.querySelector('div[data-id="resultBox"]');

            //Is the clicked element within the dropdown 
            if (domElement && !domElement.contains(event.target)) {
                this.isOpen = false;
            }
        }
    }

    handleFocus() {
        this.isFocussed = true;
        this.isOpen = true;
    }

    handleBlur() {
        this.isFocussed = false;
    }
}