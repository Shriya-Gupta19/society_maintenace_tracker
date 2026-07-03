function PageHeader({ title, subtitle, button }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">

      <div>

        <h1 className="text-3xl font-bold text-slate-100">
          {title}
        </h1>

        <p className="text-slate-400 mt-2">
          {subtitle}
        </p>

      </div>

      {button}

    </div>
  );
}

export default PageHeader;