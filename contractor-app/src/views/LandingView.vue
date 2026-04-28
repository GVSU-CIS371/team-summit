<template>
  <main class="landing">
    <section class="container py-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <h2 class="company-name mb-3">Team Summit Roofing</h2>
          <h1 class="display-5 fw-bold">
             A simple way to connect customers and contractors in the roofing industry.
          </h1>
          <p class="lead text-muted mt-3">
            Submit roofing requests, choose a contractor, receive updates, and track your project
            from inspection to completion.
          </p>

          <div class="d-flex flex-wrap gap-2 mt-4">
            <RouterLink class="btn customer-btn btn-lg" to="/customer-login">
              Customer Login
            </RouterLink>

            <RouterLink class="btn contractor-btn btn-lg" to="/contractor-login">
              Contractor Login
            </RouterLink>

            <RouterLink class="btn account-btn btn-lg" to="/create-account">
              Create Account
            </RouterLink>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="sample-request shadow">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <strong>Sample Roofing Request</strong>
              <span class="badge text-bg-success">Requested</span>
            </div>

            <h4 class="fw-bold mb-2">Storm damage inspection</h4>
            <p class="text-muted">
              A customer submitted a request for roof damage after heavy wind.
            </p>

            <div class="job-details">
              <span>Contractor</span>
              <strong>Summit Peak Roofing</strong>
            </div>
            <div class="job-details">
              <span>Service</span>
              <strong>Roof Repair</strong>
            </div>
            <div class="job-details">
              <span>Priority</span>
              <strong>High</strong>
            </div>

            <hr />

            <div class="job-status-list">
              <div class="job-status-item clicked">Request Submitted</div>
              <div class="job-status-item">Estimate Sent</div>
              <div class="job-status-item">Work Approved</div>
              <div class="job-status-item">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container pb-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="job-progress h-100">
            <h5>Submit a Request</h5>
            <p>
              Customers enter their roofing issue, contact details, service type, and preferred
              contractor.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="job-progress h-100">
            <h5>Contractor Reviews It</h5>
            <p>
              Contractors see assigned jobs, review details, update statuses, and manage estimates.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="job-progress h-100">
            <h5>Track Progress</h5>
            <p>
              Jobs move through a clear workflow so everyone knows what stage the project is in.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="container pb-5">
      <div class="account-signup">
        <div>
          <h3 class="fw-bold mb-1">Ready to get started?</h3>
          <p class="mb-0 text-muted">
            Log in as a customer to submit a request or as a contractor to manage assigned jobs.
          </p>
        </div>
        <RouterLink class="btn account-btn" to="/create-account">
          Create an Account
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(241, 183, 82, 0.15), transparent 35%),
    #f2f5f8;
}

.company-name {
  font-size: 2rem;
  font-weight: 800;
  color: #1c2530;
  background: #f1b752;
  display: inline-block;
  padding: 12px 22px;
  border-radius: 999px;
}

.sample-request,
.job-progress,
.account-signup {
  background: white;
  border-radius: 18px;
  border: 1px solid #e4e9f0;
}

.sample-request {
  padding: 28px;
}

.job-details {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  color: #6c757d;
}

.job-details strong {
  color: #1c2530;
  text-align: right;
}

.job-status-list {
  display: grid;
  gap: 10px;
}

.job-status-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f2f5f8;
  color: #6c757d;
  font-weight: 600;
}

.job-status-item.clicked {
  background: #dbeafe;
  color: #0d6efd;
}

.job-progress {
  padding: 24px;
  box-shadow: 0 10px 25px rgba(28, 37, 48, 0.06);
}

.job-progress h5 {
  font-weight: 800;
}

.job-progress p {
  color: #6c757d;
  margin-bottom: 0;
}

.account-signup {
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  box-shadow: 0 10px 25px rgba(28, 37, 48, 0.06);
}
.customer-btn {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
  font-weight: 700;
}

.contractor-btn {
  background-color: #1c2530;
  border-color: #1c2530;
  color: white;
  font-weight: 700;
}

.account-btn {
  background-color: #f1b752;
  border-color: #f1b752;
  color: #1c2530;
  font-weight: 700;
}

.customer-btn:hover,
.contractor-btn:hover,
.account-btn:hover {
  opacity: 0.75;
}


</style>