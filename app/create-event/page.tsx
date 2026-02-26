import CreateEventForm from "@/components/CreateEventForm";

const CreateEventPage = () => {
  return (
    <section id="create-event-page">
      <h1>Create a New Event</h1>
      <p className="subheading">
        Fill in the details below and publish your event to the platform.
      </p>
      <CreateEventForm />
    </section>
  );
};

export default CreateEventPage;
