function PageHeader({ title, subtitle, button }) {
  return (
    <div className="flex justify-between items-center mb-10">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="text-slate-500 mt-2">
          {subtitle}
        </p>

      </div>

      {button}

    </div>
  );
}

export default PageHeader;