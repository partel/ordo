import {action, computed, decorate, observable} from "mobx";

class CompanyStore {
  companies = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setCompanies = companiesSnapshot => {
    companiesSnapshot.forEach(doc =>
      this.setCompany(doc.data(), doc.id)
    )
  };

  setCompany = (company, code) => {
    if (!this.companies) {
      this.companies = {};
    }
    this.companies[code] = company;
  };

  getByCode = (code) => {
    if (this.companies && code) {
      return {
        ...this.companies[code],
        code: code
      }
    }
    return {
      ...code,
      name: `code: ${code}`
    };
  };

  get companyList() {
    return Object.keys(this.companies || {}).map(code => ({
      ...this.companies[code],
      code: code
    }));
  }
}

export default decorate(CompanyStore, {
  companies: observable,
  setCompanies: action,
  setCompany: action,
  companyList: computed
});
